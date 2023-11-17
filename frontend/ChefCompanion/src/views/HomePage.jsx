import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GettingStartedModal from './GettingStarted'; // Importing the GettingStartedModal component
import './HomePage.css'; // Importing the CSS file for styling

// HomePage component
function HomePage() {
    // State to manage the visibility of the GettingStartedModal
    const [isGettingStartedModalOpen, setGettingStartedModalOpen] = useState(false);

    // Function to open the GettingStartedModal
    const openGettingStartedModal = () => {
        setGettingStartedModalOpen(true);
    };

    // Function to close the GettingStartedModal
    const closeGettingStartedModal = () => {
        setGettingStartedModalOpen(false);
    };

    return (
        <div className="container">
            {/* Title */}
            <h1 className="title">Welcome to Chef Companion, your personal recipe generator!</h1>
            
            {/* Description */}
            <p className="description">Generate recipes based on what you have from your pantry and kitchen!</p>
            
            {/* Link to the Main Page */}
            <Link to="/main">
                <button className="button">Main Page</button>
            </Link>
            
            <br />
            
            {/* Button to open the Getting Started modal */}
            <button className="button" onClick={openGettingStartedModal}>Getting Started</button>
            
            {/* GettingStartedModal component */}
            <GettingStartedModal
                isOpen={isGettingStartedModalOpen}
                onRequestClose={closeGettingStartedModal}
            />
        </div>
    );
}

export default HomePage;
