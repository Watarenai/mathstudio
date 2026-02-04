import React, { useEffect, useRef } from 'react';
import 'mathlive';
import { MathfieldElement } from 'mathlive';

interface MathInputVibeProps {
    value: string;
    onChange: (latex: string) => void;
    placeholder?: string;
    readOnly?: boolean;
    size?: 'normal' | 'large';
}

const MathInputVibe: React.FC<MathInputVibeProps> = ({
    value,
    onChange,
    placeholder = '式を入力...',
    readOnly = false,
    size = 'normal',
}) => {
    const mfRef = useRef<MathfieldElement>(null);

    useEffect(() => {
        const mf = mfRef.current;
        if (mf) {
            mf.smartMode = true;
            // @ts-ignore - virtualKeyboardMode exists at runtime
            mf.virtualKeyboardMode = 'manual';
            mf.readOnly = readOnly;

            const handleInput = (evt: Event) => {
                const target = evt.target as MathfieldElement;
                onChange(target.value);
            };

            mf.addEventListener('input', handleInput);

            return () => {
                mf.removeEventListener('input', handleInput);
            };
        }
    }, [onChange, readOnly]);

    useEffect(() => {
        if (mfRef.current && mfRef.current.value !== value) {
            mfRef.current.value = value;
        }
    }, [value]);

    const sizeClasses = {
        normal: 'text-xl p-4',
        large: 'text-3xl p-6',
    };

    return (
        <div className={`math-input-vibe ${sizeClasses[size]}`}>
            <math-field
                ref={mfRef}
                style={{
                    width: '100%',
                    outline: 'none',
                    background: 'transparent',
                    fontFamily: 'inherit',
                }}
            >
                {value}
            </math-field>
            {!value && !readOnly && (
                <span className="text-slate-300 text-sm absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none">
                    {placeholder}
                </span>
            )}
        </div>
    );
};

export default MathInputVibe;
