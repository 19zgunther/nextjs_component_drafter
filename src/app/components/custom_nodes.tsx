/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useRef, useEffect } from 'react';
import { NodeResizer, Handle } from 'reactflow';

// Local imports
import { NodeData, ComponentDesign } from './interfaces';


function TextNode({ data, selected }: { data: NodeData, selected: boolean }) {    
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const onBlur = useCallback(() => {
        if (textAreaRef.current) {
            data.label = textAreaRef.current.value;
        }
    }, [data]);

    return (
        <div className="relative w-full h-full min-w-[50px] min-h-[50px] p-4 group rounded-md border-1 border-gray-800">
            <NodeResizer minWidth={50} minHeight={50} isVisible={selected} />
            <div className="w-full h-full flex items-center justify-center">
                <textarea 
                    ref={textAreaRef}
                    id="text" 
                    name="text" 
                    defaultValue={data.label} 
                    className="w-full h-full resize-none bg-transparent text-white outline-none nodrag
                        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
                    placeholder="Enter text..."
                    onBlur={onBlur}
                    readOnly={!selected}
                />
            </div>
        </div>
    );
}

function ImageNode({ data, selected }: { data: NodeData, selected: boolean }) {
    const [imageUrl, setImageUrl] = useState<string>(data.image || '');
    
    const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        const file = evt.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImageUrl(result);
                data.image = result;
            };
            reader.readAsDataURL(file);
        }
    }, [data]);

    const deleteImage = useCallback(() => {
        setImageUrl('');
        data.image = '';
    }, [data]);
    
    return (
        <div className="relative w-full h-full min-w-[50px] min-h-[50px] p-4 group rounded-md border-1 border-gray-800">
            <NodeResizer minWidth={50} minHeight={50} isVisible={selected} />
            <div className="w-full h-full flex items-center justify-center group relative">
            {imageUrl ? (
               <>
                    <img 
                        src={imageUrl}  
                        alt="uploaded" 
                        className="w-full h-full object-contain"
                        style={{ 
                            objectFit: 'contain',
                            minWidth: '100%',
                            minHeight: '100%'
                        }}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <label className="cursor-pointer p-1 bg-gray-700 rounded hover:bg-gray-600">
                            <input 
                                type="file"
                                accept="image/*"
                                onChange={onChange}
                                className="hidden"
                            />
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </label>
                        <button 
                            onClick={deleteImage}
                            className="p-1 bg-gray-700 rounded hover:bg-gray-600"
                        >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                    </div>                    
                    
                    </>
            ) : (
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={onChange} 
                    className="nodrag text-xs border border-gray-700 rounded-md p-1"
                    placeholder="Upload Image"
                />
            )}
            </div>
        </div>
    );
}


function renderComponentNodeCanvas(canvas: HTMLCanvasElement, design: ComponentDesign) {
    const bb = canvas.getBoundingClientRect();
    canvas.width = bb.width;
    canvas.height = bb.height;
    const ctx = canvas.getContext('2d');
    const s = bb.width / design.width;
    if (ctx) {
        ctx.strokeStyle = design.lineColor;
        ctx.lineWidth = design.lineWidth;
        
        for (const step of design.path) {
            if (step.cmd === 'beginPath') {
                ctx.beginPath();
            } else if (step.cmd === 'closePath') {
                ctx.closePath();
            } else if (step.cmd === 'moveTo') {
                ctx.moveTo(step.x * s, step.y * s);
            } else if (step.cmd === 'lineTo') {
                ctx.lineTo(step.x * s, step.y * s);
            } else if (step.cmd === 'stroke') {
                ctx.stroke();
            } else if (step.cmd === 'arc') {
                ctx.arc(step.x * s, step.y * s, step.r * s, step.startAngle, step.endAngle);
            } else {
                console.error('renderComponentNodeCanvas() Unknown command: ' + step.cmd);
            }
        }
    }
}


function ComponentNode({ data, selected }: { data: NodeData, selected: boolean }) {    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const scale = 5; // TODO: Make this dynamic so user can resize

    // const design = BATTERY_DESGIN;

    const design = data.design;

    useEffect(() => {
        // Constantly re-render the canvas to update the display
        const interval = setInterval(() => {
            if (canvasRef.current && design) {
                renderComponentNodeCanvas(canvasRef.current, design);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [canvasRef, scale, design]);

    if (!design) {
        console.error("ComponentNode() No design found for node: " + data);
        return null;
    }


    function applyScaleToStyle(style: any) {
        return {
            ...style,
            left: style.left * scale,
            bottom: style.bottom * scale,
            right: style.right * scale
        }
    }

    return (
        <div className={"relative w-fit h-fit p-0 m-0 rounded-md border-1" + (selected ? " border-gray-800" : "border-transparent")}>
            <canvas ref={canvasRef} style={{ width: design.width * scale, height: design.height * scale }} />

            {design.handles.map((item, index) => (
                <Handle
                    key={index}
                    id={item.id}
                    type={item.type}
                    position={item.position}
                    style={applyScaleToStyle(item.style)}
                    isConnectable={true}
                />
            ))}
            {/* <Handle type="target" position={Position.Top} /> */}
        </div>
    );
}


const nodeTypes = {
    TextNode: TextNode,
    ImageNode: ImageNode,
    ComponentNode: ComponentNode,
};


enum NodeType { 
    TEXT = 'text',
    IMAGE = 'image',
    BATTERY = 'battery',
    LED = 'led',
}

export { nodeTypes, TextNode, ImageNode, ComponentNode, NodeType };