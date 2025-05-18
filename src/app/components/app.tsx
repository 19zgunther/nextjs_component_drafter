"use client"

import { useState, useCallback, useEffect } from 'react';
import 'reactflow/dist/style.css';

// Local imports
import { FlowFile, SaveStatus } from './interfaces';
import Flow from './flow';
import SaveModal from './modals/saveModal';
import LoadFileModal from './modals/loadFileModal';
import { LoginModal } from './modals/loginModal';
import { ConfirmCancelModal } from './modals/confirmCancelModal';


function App() {
    const [file, setFile] = useState<FlowFile>({fileName: "", nodes: [], edges: [], email: "", isPublic: false});
    const [isSaveModalOpen, setSaveModalOpen] = useState<boolean>(false);
    const [isLoadFileModalOpen, setLoadFileModalOpen] = useState<boolean>(true); // Open by default
    const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.SAVING);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [sentLoginEmail, setSentLoginEmail] = useState<boolean>(false);


    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

    const handleDelete = useCallback(() => {
        fetch(`/api/files/`, {
            credentials: 'include',
            method: 'DELETE',
            body: JSON.stringify({fileName: file.fileName}),
        })
        .then(response => {
            if (response.status === 200) {
                setIsConfirmDeleteOpen(false);
                setLoadFileModalOpen(true);
            } else if (response.status === 403) {
                setIsConfirmDeleteOpen(false);
                setDeleteErrorMessage("You do not have permission to delete this file");
            } else {
                setDeleteErrorMessage("Error deleting file");
            }
        })
        .catch(error => {
            console.error('Error deleting file:', error);
        });
    }, [file.fileName]);


    const handleLoginClick = useCallback((email: string) => {
        fetch('/api/getSendLoginEmail?email=' + email, {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.status === 200) {
                setSentLoginEmail(true);
            } else {
                setSentLoginEmail(false);
            }
            setIsLoggedIn(false);
        })
        .catch(error => {
            setIsLoggedIn(false);
            console.error('Error logging in:', error);
        });
    }, []);

    const handleSaveFile = useCallback(() => {
        setSaveModalOpen(true); // Open modal immediately to show "Saving..." status
        
        fetch('/api/files', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(file)
        })
        .then(response => {
            if (response.status === 401) { setIsLoggedIn(false); }
            if (!response.ok) throw new Error('Failed to save flow');
            setSaveStatus(SaveStatus.SAVED);
        })
        .catch(error => {
            console.error('Error saving flow:', error);
            setSaveStatus(SaveStatus.ERROR);
        });
    }, [file]);

    // Poll while we're not logged in to see if the user is logged in
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isLoggedIn) {
                // test to see if the user is logged in
                fetch('/api/sanity', { credentials: 'include' })
                .then(response => {
                    if (response.status === 201) {
                        setIsLoggedIn(true);
                    }
                })
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isLoggedIn]);


    return (
        <div className='h-full w-full'>
            <Flow file={file} setFile={setFile} handleSaveFile={handleSaveFile} setIsConfirmDeleteOpen={setIsConfirmDeleteOpen} />
            <SaveModal 
                isOpen={isSaveModalOpen}
                onClose={() => {
                    setSaveModalOpen(false);
                    setSaveStatus(SaveStatus.SAVING); // Reset status for next save
                    setTimeout(() => setLoadFileModalOpen(true), 200);
                }}
                fileName={file.fileName}
                saveStatus={saveStatus}
            />
            <LoadFileModal 
                isOpen={isLoadFileModalOpen}
                onClose={() => setLoadFileModalOpen(false)}
                onLoad={setFile}
            />
            <LoginModal 
                isOpen={!isLoggedIn}
                sentLoginEmail={sentLoginEmail}
                onLoginClick={handleLoginClick}
            />
            <ConfirmCancelModal 
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Diagram"
                message={`Are you sure you want to delete "${file.fileName}"? This action cannot be undone. ${deleteErrorMessage}`}
            />
        </div>
    );
}
   
export default App;