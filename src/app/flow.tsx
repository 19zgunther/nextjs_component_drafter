"use client"
import { ReactFlow, Background, Controls, applyEdgeChanges, applyNodeChanges, addEdge } from '@xyflow/react';
import { useState, useCallback } from 'react';
import '@xyflow/react/dist/style.css';

// Local imports
import { Edge, Node, FlowData, SaveModalProps, LoadModalProps } from './interfaces';
import { nodeTypes } from './custom_nodes';
 

// Add Modal component
function SaveModal({ isOpen, onClose, flowData, fileName }: SaveModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-xl text-white mb-4">Save Flow - {fileName}</h2>
                <pre className="bg-gray-900 p-4 rounded text-sm text-gray-300 overflow-auto max-h-96">
                    {JSON.stringify(flowData, null, 2)}
                </pre>
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

// Add this component near SaveModal
function LoadModal({ isOpen, onClose, onLoad }: LoadModalProps) {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    const handleLoad = () => {
        try {
            const data = JSON.parse(inputValue);
            if (!data.nodes || !data.edges) {
                throw new Error('Invalid flow data format');
            }
            onLoad(data);
            onClose();
            setError('');
        } catch (e) {
            setError('Invalid JSON format:' + e);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-xl text-white mb-4">Load Flow</h2>
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Paste your flow configuration here..."
                    className="w-full h-48 p-2 bg-gray-900 text-gray-300 rounded mb-2 resize-none"
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={onClose}
                        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleLoad}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Load
                    </button>
                </div>
            </div>
        </div>
    );
}


function Flow() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isSaveModalOpen, setSaveModalOpen] = useState<boolean>(false);
    const [isLoadModalOpen, setLoadModalOpen] = useState<boolean>(true); // Open by default
    const [fileName, setFileName] = useState<string>('my-flow-diagram');


    const addNode = (type: 'text' | 'image') => {

        // Find a new ID for the node
        let maxId = 0;
        for (const node of nodes) {
            maxId = Math.max(maxId, Number(node.id));
        }

        // Handle selecting and uploading an image
        if (type === 'image') {
            // Auto-click an input element
            const el = document.createElement('input');
            el.type = 'file';
            el.accept = 'image/*';
            el.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;

                // Read file, load as image
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    setNodes([...nodes, {
                        id: String(maxId+1),
                        type: 'ImageNode',
                        position: { x: 0, y: 0 },
                        data: { label: 'Image Node', image: result },
                    }]);
                }
                reader.readAsDataURL(file);
            }
            el.click();
        } else {
            setNodes([...nodes, {
                id: String(maxId+1),
                type: type === 'text' ? 'TextNode' : 'ImageNode',
                position: { x: 0, y: 0 },
                data: { label: 'Text Node', image: '' },
            }]);
        }
    }
    const onNodesChange = useCallback(
        (changes: any) => {
            setNodes((nds: Node[]) => applyNodeChanges(changes, nds));
        }, []
    );
    const onEdgesChange = useCallback(
        (changes: any) => {
            setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds));
        }, []
    );
    const onConnect = useCallback(
        (params: any) => {
            setEdges((eds: Edge[]) => addEdge(params, eds));
        }, []
    );

    const handleLoad = useCallback((data: FlowData) => {
        setFileName(data.fileName);
        setNodes(data.nodes as Node[]);
        setEdges(data.edges as Edge[]);
    }, []);

    const handleSave = useCallback(() => {
        console.log('Flow Data:', { nodes, edges });
        setSaveModalOpen(true);
    }, [nodes, edges]);

    return (
        <div className='h-full w-full'>
            <div className='flex items-center justify-between p-2 bg-gray-90 border-b border-gray-700'>
                <div className='flex items-center gap-4'>
                    <button 
                        onClick={() => addNode('text')}
                        className='bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700'
                    >
                        Add Text
                    </button>
                    <button 
                        onClick={() => addNode('image')}
                        className='bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700'
                    >
                        Add Image
                    </button>
                </div>
                <div className='flex items-center gap-2'>
                    <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="File name"
                        className="bg-gray-800 text-white px-3 py-1 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
                    />
                    <button 
                        onClick={handleSave}
                        className='bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700'
                    >
                        Save Diagram
                    </button>
                </div>
            </div>
            <ReactFlow 
                nodes={nodes} 
                edges={edges} 
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange} 
                onEdgesChange={onEdgesChange} 
                onConnect={onConnect}
                colorMode='dark'>
                <Background />
                <Controls />
            </ReactFlow>
            <SaveModal 
                isOpen={isSaveModalOpen}
                onClose={() => setSaveModalOpen(false)}
                flowData={{ fileName, nodes, edges }}
                fileName={fileName}
            />
            <LoadModal 
                isOpen={isLoadModalOpen}
                onClose={() => setLoadModalOpen(false)}
                onLoad={handleLoad}
            />
        </div>
    );
}
   
export default Flow;