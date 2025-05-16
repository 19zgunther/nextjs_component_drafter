import { useState, useCallback, useRef } from 'react';
import { NodeResizer } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Local imports
import { NodeData } from './interfaces';



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

const nodeTypes = {
    TextNode: TextNode,
    ImageNode: ImageNode,
};

export { nodeTypes, TextNode, ImageNode };