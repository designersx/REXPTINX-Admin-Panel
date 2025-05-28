import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
    const isAuthenticated = localStorage.getItem('token'); 

    return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
