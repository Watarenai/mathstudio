import React from 'react';
import { motion } from 'framer-motion';

interface DraggableChipProps {
    value: string;
    label: string;
    type: 'number' | 'operator' | 'variable';
    color?: string;
    onDragEnd?: (e: MouseEvent | TouchEvent | PointerEvent) => void;
}

const DraggableChip: React.FC<DraggableChipProps> = ({
    value: _value,
    label,
    type,
    color = 'bg-white',
    onDragEnd,
}) => {
    const baseColors = {
        number: 'bg-vibe-sky border-blue-200 text-blue-700',
        operator: 'bg-vibe-orange border-orange-200 text-orange-700',
        variable: 'bg-vibe-mint border-emerald-200 text-emerald-700',
    };

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.1}
            whileDrag={{
                scale: 1.1,
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                zIndex: 100,
            }}
            whileHover={{
                scale: 1.05,
                y: -2,
            }}
            whileTap={{
                scale: 0.95,
            }}
            onDragEnd={(e) => onDragEnd?.(e)}
            className={`
        inline-flex items-center justify-center
        px-5 py-3 rounded-2xl
        font-bold text-xl
        cursor-grab active:cursor-grabbing
        select-none
        border-2
        shadow-md
        transition-colors duration-200
        ${color || baseColors[type]}
      `}
            style={{ touchAction: 'none' }}
        >
            {label}
        </motion.div>
    );
};

export default DraggableChip;
