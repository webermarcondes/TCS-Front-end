// Layout.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import BackButton from '../buttons/botaoVoltar';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="container mt-5">
            {location.pathname !== '/' && <BackButton />}
            {children}
        </div>
    );
};

export default Layout;
