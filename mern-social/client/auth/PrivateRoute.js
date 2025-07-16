import React from 'react'
import { Navigate, useLocation } from 'react-router-dom' // Import useLocation
import auth from './auth-helper'

const PrivateRoute = ({ children }) => {
    const location = useLocation(); // Dapatkan objek lokasi saat ini menggunakan useLocation()

    // Asumsikan auth.isAuthenticated() mengembalikan true/false
    if (auth.isAuthenticated()) {
        return children; // Jika terautentikasi, render children (komponen yang dilindungi)
    }

    // Jika tidak terautentikasi, alihkan ke halaman signin
    return <Navigate to="/signin" state={{ from: location }} replace />;
}

export default PrivateRoute