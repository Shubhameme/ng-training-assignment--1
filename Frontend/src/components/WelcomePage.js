// src/components/WelcomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css'; // Import a CSS file for additional styles

const WelcomePage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/tasks');
    };

    return (
        <div className="welcome-page d-flex flex-column align-items-center justify-content-center text-center">
            <div className="overlay">
                <h1 className="display-4 text-white mb-4">Welcome to Enzigma To-Do List Application</h1>
                <p className="lead text-light mb-5">Manage your tasks efficiently and effectively!</p>
                <button className="btn btn-lg btn-success" onClick={handleGetStarted}>
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default WelcomePage;
