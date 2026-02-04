import React from 'react';
import { Tldraw, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import { useEffect } from 'react';
import SubstitutionBlocks from './SubstitutionBlocks';

export type CanvasTool = 'draw' | 'text' | 'select' | 'eraser';

interface CreativePlaygroundProps {
    activeTool?: CanvasTool;
    showSubstitutionBlocks?: boolean;
    initialExpression?: string;
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

const CreativePlayground: React.FC<CreativePlaygroundProps> = ({
    activeTool = 'draw',
    showSubstitutionBlocks = true,
    initialExpression = '',
}) => {
    return (
        <div className="h-full flex flex-col relative">
            {/* Dot Grid Background */}
            <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none z-0" />

            {/* Main Canvas Area */}
            <div className="flex-1 relative z-10">
                {showSubstitutionBlocks ? (
                    // Substitution Blocks Mode
                    <div className="h-full overflow-y-auto custom-scrollbar p-8">
                        <SubstitutionBlocks initialExpression={initialExpression} />
                    </div>
                ) : (
                    // Free Canvas Mode (tldraw)
                    <div className="w-full h-full">
                        <Tldraw
                            persistenceKey="mathstudio-vibe-canvas"
                            hideUi={true}
                        >
                            <CanvasController activeTool={activeTool} />
                        </Tldraw>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreativePlayground;
