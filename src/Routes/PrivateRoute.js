// ProtectedRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    return isLoggedIn ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
