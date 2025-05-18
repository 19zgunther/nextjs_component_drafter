/* eslint-disable @typescript-eslint/no-explicit-any */

interface FlowFile {
    email: string;
    fileName: string;
    isPublic: boolean;
    nodes: Node[];
    edges: Edge[];
}


// save status enum
enum SaveStatus {
    SAVING = 'saving',
    SAVED = 'saved',
    ERROR = 'error'
}

interface ComponentDesign {
    width: number;
    height: number;
    lineWidth: number;
    lineColor: string;
    path: any[]; // TODO: thoroughly type this
    handles: any[]; // TODO: thoroughly type this
}

interface NodeData {
    label: string;
    image?: string;
    design?: ComponentDesign;
}

interface Node {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: NodeData;
}

interface Edge {
    id: string;
    source: string;
    target: string;
}

export type { NodeData, Edge, Node, FlowFile, ComponentDesign };
export { SaveStatus };
