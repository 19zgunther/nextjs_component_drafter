// Add this interface near the top of the file
interface NodeData {
    label: string;
    image?: string;
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

// Add these interfaces at the top of the file
interface FlowData {
    fileName: string;
    nodes: Node[];
    edges: Edge[];
}

interface SaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    flowData: FlowData;
    fileName: string;
}

interface LoadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoad: (data: FlowData) => void;
}

export type { NodeData, Edge, Node, FlowData, SaveModalProps, LoadModalProps };