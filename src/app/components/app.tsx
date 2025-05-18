"use client"

import { useState, useCallback, useEffect } from 'react';
import 'reactflow/dist/style.css';
import { Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import FilesIcon from '@mui/icons-material/Folder';

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
    const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState<boolean>(false);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.SAVING);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isActuallyLoggedIn, setIsActuallyLoggedIn] = useState<boolean>(false);
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

    const handleLogoutClick = useCallback(() => {
        fetch('/api/logout', { credentials: 'include' })
        .then(() => {
            setIsLoggedIn(true); // close login modal
            setSaveModalOpen(false);
            setLoadFileModalOpen(true);
            setIsConfirmDeleteOpen(false);
            setDeleteErrorMessage("");
            setFile({fileName: "", nodes: [], edges: [], email: "", isPublic: false});
        })
        .catch(error => {
            console.error('Error logging out:', error);
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

    // After 10 seconds, clear the 
    useEffect(() => {
        if (sentLoginEmail) {
            setTimeout(() => {
                setSentLoginEmail(false);
            }, 10000);
        }
    }, [sentLoginEmail]);


    // Repeatedly poll to see if we're actually logged in
    useEffect(() => {
        const interval = setInterval(() => {
            fetch('/api/sanity', { credentials: 'include' })
            .then(response => {
                if (response.status === 201) { setIsActuallyLoggedIn(true); }
                else { setIsActuallyLoggedIn(false); }
            })
            .catch(error => {
                console.error('Error checking if logged in:', error);
                setIsActuallyLoggedIn(false);
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className='h-full w-full'>
            <Flow 
                file={file} 
                setFile={setFile} 
                handleSaveFile={handleSaveFile} 
                setIsConfirmDeleteOpen={setIsConfirmDeleteOpen} 
                isLoggedIn={isActuallyLoggedIn}
            />
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
                isLoggedIn={isActuallyLoggedIn}
            />
            <LoginModal 
                isOpen={!isLoggedIn}
                sentLoginEmail={sentLoginEmail}
                onLoginClick={handleLoginClick}
                onCancel={() => setIsLoggedIn(true)}
                isLoggedIn={isActuallyLoggedIn}
            />
            <ConfirmCancelModal 
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Diagram"
                message={`Are you sure you want to delete "${file.fileName}"? This action cannot be undone. ${deleteErrorMessage}`}
                confirmButtonText="Delete"
            />
            <div className='flex flex-row gap-2 absolute top-2 right-2 z-1000'>
                <Button 
                    variant="contained"
                    startIcon={ <FilesIcon />}
                    onClick={ () => {setLoadFileModalOpen(true); }}
                >
                    Files
                </Button>

                <Button 
                    variant="contained"
                    startIcon={ isActuallyLoggedIn ? <LogoutIcon /> : <LoginIcon />}
                    onClick={ () => {if (isActuallyLoggedIn) { setIsConfirmLogoutOpen(true); } else { setIsLoggedIn(false); }}}
                >
                    {isActuallyLoggedIn ? "Logout" : "Login"}
                </Button>
            </div>
            
            <ConfirmCancelModal 
                isOpen={isConfirmLogoutOpen}
                onClose={() => setIsConfirmLogoutOpen(false)}
                onConfirm={handleLogoutClick}
                title="Logout"
                message={`Are you sure you want to logout? You are currently logged ${isActuallyLoggedIn ? 'in' : 'out'}.`}
                confirmButtonText="Logout"
            />
        </div>
    );
}
   
export default App;