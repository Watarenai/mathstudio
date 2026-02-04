import { Tldraw, useEditor } from 'tldraw'
import 'tldraw/tldraw.css'
import { useEffect } from 'react'

export type CanvasTool = 'draw' | 'text' | 'select' | 'eraser';

interface InfiniteCanvasProps {
    activeTool?: CanvasTool;
}

// Inner component to access the editor context
function CanvasController({ activeTool }: { activeTool: CanvasTool }) {
    const editor = useEditor();

    useEffect(() => {
        if (activeTool === 'draw') {
            editor.setCurrentTool('draw');
        } else if (activeTool === 'text') {
            editor.setCurrentTool('text');
        } else if (activeTool === 'select') {
            editor.setCurrentTool('select');
        } else if (activeTool === 'eraser') {
            editor.setCurrentTool('eraser');
        }
    }, [activeTool, editor]);

    return null;
}

export default function InfiniteCanvas({ activeTool = 'draw' }: InfiniteCanvasProps) {
    return (
        <div className="tldraw__editor w-full h-full relative z-0">
            <Tldraw
                persistenceKey="mathbudy-canvas"
                hideUi={true} // Hide default UI for simplicity
            >
                <CanvasController activeTool={activeTool} />
            </Tldraw>
        </div>
    )
}
