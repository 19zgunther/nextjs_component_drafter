"use client"

import { useState } from 'react';

interface LoginModalProps {
    isOpen: boolean;
    sentLoginEmail: boolean;
    onLoginClick: (email: string) => void;
    onCancel: () => void;
    isLoggedIn: boolean;
}


function LoginModal({ isOpen, sentLoginEmail, onLoginClick, onCancel, isLoggedIn }: LoginModalProps) {
    const [email, setEmail] = useState<string>('');
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800/90 p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-xl text-white mb-4">Login to ComponentDrafter</h2>
                
                <p className="text-gray-300 mb-4">
                    Enter your email address to receive a secure login link
                </p>

                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-md mb-4 
                             border border-gray-600 focus:outline-none focus:border-blue-500"
                />

                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => onLoginClick(email)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 
                                 disabled:bg-blue-800 disabled:cursor-not-allowed"
                        disabled={!email.includes('@')}
                    >
                        Send Login Link
                    </button>
                    <button onClick={onCancel} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                        Cancel
                    </button>
                </div>

                {sentLoginEmail && (
                    <div className="mt-4 p-4 bg-green-900 text-green-200 rounded-md">
                        <p>Login email sent! Please check your email (including spam folder) for the login link.</p>
                    </div>
                )}

                {isLoggedIn && (
                    <div className="mt-4 p-4 bg-green-900 text-green-200 rounded-md">
                        <p>You are logged in</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export { LoginModal };

