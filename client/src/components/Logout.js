import React from 'react';
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        api.logout();
        navigate('/');
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default Logout;