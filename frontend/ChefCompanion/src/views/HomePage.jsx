import { useState } from 'react';
import { Link } from 'react-router-dom';
import GettingStartedModal from './GettingStarted';
import './HomePage.css';

function HomePage() {
    const [isGettingStartedModalOpen, setGettingStartedModalOpen] = useState(false);

    const openGettingStartedModal = () => {
        setGettingStartedModalOpen(true);
    };

    const closeGettingStartedModal = () => {
        setGettingStartedModalOpen(false);
    };

    return (
        <div className="container">
            <h1 className="title">Welcome to Chef Companion, your personal recipe generator!</h1>
            <p className="description">Generate recipes based on what you have from your pantry and kitchen!</p>
            <Link to="/main">
                <button className="button">Main Page</button>
            </Link>
            <br />
            <button className="button" onClick={openGettingStartedModal}>Getting Started</button>
            <GettingStartedModal
                isOpen={isGettingStartedModalOpen}
                onRequestClose={closeGettingStartedModal}
            />
        </div>
    );
}

export default HomePage;
