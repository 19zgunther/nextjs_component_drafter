"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactFlow, Background, Controls, applyEdgeChanges, applyNodeChanges, addEdge, ConnectionMode } from 'reactflow';
import { useCallback } from 'react';
import 'reactflow/dist/style.css';

// Local imports
import { Node, FlowFile } from './interfaces';
import { nodeTypes, NodeType } from './custom_nodes';
import { LED_DESGIN, BATTERY_DESGIN } from './custom_component_designs';


function Flow({file, setFile, handleSaveFile, setIsConfirmDeleteOpen, isLoggedIn}: {file: FlowFile, setFile: (file: FlowFile) => void, handleSaveFile: () => void, setIsConfirmDeleteOpen: (isOpen: boolean) => void, isLoggedIn: boolean }) {

    const onNodesChange = useCallback(
        (changes: any) => {
            console.log("onNodesChange", changes);
            file.nodes = applyNodeChanges(changes, file.nodes) as Node[];
            setFile({...file});
        }, [file, setFile]
    );
    const onEdgesChange = useCallback(
        (changes: any) => {
            console.log("onEdgesChange", changes);
            const newEdges = applyEdgeChanges(changes, file.edges);
            setFile({...file, edges: newEdges});
        }, [file, setFile]
    );
    const onConnect = useCallback(
        (params: any) => {
            console.log("onConnect", params);
            const newEdges = addEdge(params, file.edges);
            setFile({...file, edges: newEdges});
        }, [file, setFile]
    );


    const addNode = useCallback((type: NodeType) => {

        // Find a new ID for the node
        let maxId = 0;
        for (const node of file.nodes) {
            maxId = Math.max(maxId, Number(node.id));
        }

        // Handle selecting and uploading an image
        if (type === NodeType.IMAGE) {
            // Auto-click an input element
            const el = document.createElement('input');
            el.type = 'file';
            el.accept = 'image/*';
            el.onchange = (e) => {
                const imgFile = (e.target as HTMLInputElement).files?.[0];
                if (!imgFile) return;

                // Read file, load as image
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    file.nodes = [...file.nodes, {
                        id: String(maxId+1  ),
                        type: 'ImageNode',
                        position: { x: 0, y: 0 },
                        data: { label: 'Image Node', image: result },
                    }];
                    console.log("HERE, adding image node", file);
                    setFile({...file});
                }
                reader.readAsDataURL(imgFile);
            }
            el.click();
        } else if (type === NodeType.TEXT) {
            file.nodes = [...file.nodes, {
                id: String(maxId+1),
                type: 'TextNode',
                position: { x: 0, y: 0 },
                data: { label: 'Text Node', image: '' },
            }];
            setFile({...file});
        } else if (type === NodeType.BATTERY) {
            file.nodes = [...file.nodes, {
                id: String(maxId+1),
                type: 'ComponentNode',
                position: { x: 0, y: 0 },
                data: { label: 'Component Node', image: '', design: BATTERY_DESGIN },
            }];
            setFile({...file});
        } else if (type === NodeType.LED) {
            file.nodes = [...file.nodes, {
                id: String(maxId+1),
                type: 'ComponentNode',
                position: { x: 0, y: 0 },
                data: { label: 'Component Node', image: '', design: LED_DESGIN },
            }];
            setFile({...file});
        } else {
            console.error("Invalid node type");
        }
    }, [file, setFile]);


    return (
        <div className='h-full w-full'>
            <div className='flex items-center justify-between p-2 bg-gray-90 border-b border-gray-700'>
                <div className='flex items-center gap-4'>
                    <button 
                        onClick={() => addNode(NodeType.TEXT)}
                        className='bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700'
                    >
                        Add Text
                    </button>
                    <button 
                        onClick={() => addNode(NodeType.IMAGE)}
                        className='bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700'
                    >
                        Add Image
                    </button>
                    <button 
                        onClick={() => addNode(NodeType.BATTERY)}
                        className='bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700'
                    >
                        Add Battery
                    </button>
                    <button 
                        onClick={() => addNode(NodeType.LED)}
                        className='bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700'
                    >
                        Add LED
                    </button>
                </div>
                <div className='flex items-center gap-2'>
                    {isLoggedIn && 
                    <>
                        <input
                            type="text"
                            value={file.fileName}
                            onChange={(e) => setFile({...file, fileName: e.target.value})}
                            placeholder="File name"
                            className="bg-gray-800 text-white px-3 py-1 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500"
                        />
                        <button 
                            onClick={handleSaveFile}
                            className='bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700'
                        >
                            Save Diagram
                        </button>
                        <button
                            onClick={() => setFile({...file, isPublic: !file.isPublic})}
                            className='bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700'
                        >
                            {file.isPublic ? "Make Private" : "Make Public"}
                        </button>
                        {file.fileName && (
                            <button
                                onClick={() => setIsConfirmDeleteOpen(true)}
                                className='bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700'
                            >
                                Delete Diagram
                            </button>
                        )}
                    </>}
                </div>
            </div>
            <ReactFlow 
                nodes={file.nodes} 
                edges={file.edges} 
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange} 
                onEdgesChange={onEdgesChange} 
                onConnect={onConnect}
                connectionMode={ConnectionMode.Loose}
                >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}

export default Flow;