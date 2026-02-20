import React from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

const TldrawPanel: React.FC = () => (
    <Tldraw persistenceKey="mathbudy-scratchpad" hideUi={false} />
);

export default TldrawPanel;
