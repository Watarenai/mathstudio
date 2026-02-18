import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import LandingPage from './components/LandingPage.tsx'
import './index.css'

const Root = () => {
    const [showApp, setShowApp] = useState(false);

    if (showApp) {
        return <App />;
    }

    return <LandingPage onStart={() => setShowApp(true)} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>,
)
