"use client"

import { useState, useEffect } from 'react';
import 'reactflow/dist/style.css';

// Local imports
import { FlowFile } from '../interfaces';

interface LoadFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoad: (data: FlowFile) => void;
}

// Add this component near SaveModal
function LoadFileModal({ isOpen, onClose, onLoad }: LoadFileModalProps) {
    const [files, setFiles] = useState<Array<FlowFile>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetch('/api/files', { credentials: 'include' })
                .then(res => res.json())
                .then(data => {
                    setFiles(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error loading files:', err);
                    setError('Failed to load files');
                    setLoading(false);
                });
        }
    }, [isOpen]);

    const handleLoadDiagrams = (file: FlowFile) => {
        onLoad(file);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800/90 p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-xl text-white mb-4">Load Flow Diagram</h2>
                
                {loading ? (
                    <div className="text-white text-center py-4">Loading...</div>
                ) : error ? (
                    <div className="text-red-500 text-center py-4">{error}</div>
                ) : files.length === 0 ? (
                    <div className="text-gray-400 text-center py-4">No saved flows found</div>
                ) : (
                    <div className="max-h-96 overflow-y-auto">
                        {files.map((file) => (
                            <div
                                key={file.fileName}
                                onClick={() => handleLoadDiagrams(file)}
                                className="p-3 bg-gray-700 rounded mb-2 cursor-pointer hover:bg-gray-600 text-white"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{file.fileName}</span>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        file.isPublic ? 'bg-green-800' : 'bg-red-800'
                                    }`}>
                                        {file.isPublic ? 'Public' : 'Private'}
                                    </span>
                                </div>
                                {file.email && (
                                    <div className="text-gray-400 text-sm mt-1">
                                        Created by: {file.email}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div
                            key={"new"}
                            onClick={() => handleLoadDiagrams({
                                fileName: "New Diagram", 
                                nodes: [], 
                                edges: [], 
                                email: "", 
                                isPublic: false
                            })}
                            className="p-3 bg-gray-700 rounded mb-2 cursor-pointer hover:bg-gray-600 text-white"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium">New Diagram</span>
                                <span className="text-xs px-2 py-1 rounded bg-blue-800">New</span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="mt-4 flex justify-end gap-2">
                    <button 
                        onClick={onClose}
                        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoadFileModal;