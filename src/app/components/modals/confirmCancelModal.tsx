"use client"


interface ConfirmCancelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
    title: string;
}

function ConfirmCancelModal({ isOpen, onClose, onConfirm, message, title }: ConfirmCancelModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800/90 p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-xl text-white mb-4">{title}</h2>
                <p className="text-gray-300 mb-6">{message}</p>
                
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={onClose}
                        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export { ConfirmCancelModal };
export type { ConfirmCancelModalProps };
