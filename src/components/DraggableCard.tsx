import React, { useState, useRef, useEffect } from 'react';
import { GripHorizontal } from 'lucide-react';

interface DraggableCardProps {
    title: string;
    children: React.ReactNode;
    initialPosition?: { x: number; y: number };
    className?: string;
    onClose?: () => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
    title,
    children,
    initialPosition = { x: 20, y: 20 },
    className = "",
    onClose
}) => {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const cardStartPos = useRef({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const dx = e.clientX - dragStartPos.current.x;
            const dy = e.clientY - dragStartPos.current.y;

            setPosition({
                x: cardStartPos.current.x + dx,
                y: cardStartPos.current.y + dy
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Prevent drag if clicking close button
        if ((e.target as HTMLElement).closest('.close-btn')) return;

        setIsDragging(true);
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        cardStartPos.current = { ...position };
    };

    return (
        <div
            ref={cardRef}
            className={`absolute flex flex-col bg-white rounded-xl shadow-2xl border-2 border-slate-300 overflow-hidden ${className} ${isDragging ? 'z-50 cursor-grabbing' : 'z-40'}`}
            style={{
                left: position.x,
                top: position.y,
                transition: isDragging ? 'none' : 'box-shadow 0.2s'
            }}
        >
            {/* Drag Handle / Header */}
            <div
                onMouseDown={handleMouseDown}
                className={`bg-slate-100 p-2 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-slate-200 ${isDragging ? 'bg-blue-100' : ''}`}
            >
                <div className="flex items-center gap-2">
                    <GripHorizontal className="text-slate-400 w-5 h-5" />
                    <h3 className="font-bold text-slate-600 text-sm select-none">{title}</h3>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="close-btn p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="M6 6 18 18" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="p-2 overflow-auto max-h-[80vh]">
                {children}
            </div>
        </div>
    );
};

export default DraggableCard;
