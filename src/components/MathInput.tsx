import React, { useEffect, useRef } from 'react';
import 'mathlive';
import { MathfieldElement } from 'mathlive';

interface MathInputProps {
    value: string;
    onChange: (latex: string) => void;
    readOnly?: boolean;
}

const MathInput: React.FC<MathInputProps> = ({ value, onChange, readOnly = false }) => {
    const mfRef = useRef<MathfieldElement>(null);

    useEffect(() => {
        // MathLiveのカスタム要素にアクセスして設定を行う
        const mf = mfRef.current;
        if (mf) {
            mf.smartMode = true; // 数学的な入力を補助するモード
            // @ts-ignore - virtualKeyboardMode exists at runtime
            mf.virtualKeyboardMode = 'manual'; // 必要に応じてキーボードを表示
            mf.readOnly = readOnly;

            // 値が変更されたときのイベントリスナー
            // Note: MathLive events are dispatched on the element
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

    // 外部からのvalue変更を反映
    useEffect(() => {
        if (mfRef.current && mfRef.current.value !== value) {
            mfRef.current.value = value;
        }
    }, [value]);

    return (
        <div className="math-input-wrapper text-2xl p-2 border border-gray-300 rounded shadow-sm bg-white">
            <math-field
                ref={mfRef}
                style={{
                    width: '100%',
                    outline: 'none',
                    padding: '8px',
                    borderRadius: '4px'
                }}
            >
                {value}
            </math-field>
        </div>
    );
};

export default MathInput;
