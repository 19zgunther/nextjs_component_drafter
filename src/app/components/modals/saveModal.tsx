"use client"

import { useState, useEffect } from 'react';
import 'reactflow/dist/style.css';

// Local imports
import { SaveStatus } from '../interfaces';


interface SaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileName: string;
    saveStatus: SaveStatus;
}


// Add Modal component
function SaveModal({ isOpen, onClose, fileName, saveStatus }: SaveModalProps) {
    const [saveStatusLocal, setSaveStatusLocal] = useState<SaveStatus>(SaveStatus.SAVING);

    useEffect(() => {
        setTimeout(() => {
            setSaveStatusLocal(saveStatus);
        }, 500);
    }, [saveStatus]);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800/90 p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-xl text-white mb-4">Save Flow - {fileName}</h2>
                <div className="text-center py-4">
                    {saveStatusLocal === SaveStatus.SAVING && (
                        <p className="text-blue-400">Saving to server...</p>
                    )}
                    {saveStatusLocal === SaveStatus.SAVED && (
                        <p className="text-green-400">Saved to server!</p>
                    )}
                    {saveStatusLocal === SaveStatus.ERROR && (
                        <p className="text-red-400">Error saving to server</p>
                    )}
                </div>
                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SaveModal;