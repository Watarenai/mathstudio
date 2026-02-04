declare namespace JSX {
    interface IntrinsicElements {
        'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            'virtual-keyboard-mode'?: string;
            // Add other properties if needed
        };
    }
}
