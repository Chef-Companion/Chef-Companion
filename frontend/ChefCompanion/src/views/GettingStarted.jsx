import React from 'react';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

function GettingStartedModal({ isOpen, onRequestClose }) {
    // Define custom styles
    const modalStyles = {
        content: {
            maxWidth: '400px', 
            maxHeight: '300px', 
            margin: 'auto',    
            textAlign: 'center',
        },
    };

    return (
        // Create the popout window
        <Modal
            isOpen={isOpen}                 
            onRequestClose={onRequestClose} 
            contentLabel="Getting Started Modal"
            style={modalStyles}              
        >
            <h3>Welcome!</h3>  
            <p>
                Welcome to Chef Companion! Generate recipes based on what you have from your pantry and kitchen. 
            </p>
            <h3>Generating Recipes</h3>
            <p>
                To use this application, please exit this window and click on the Main Page button.
                Use the search bar to find ingredients and add them to the list. Select desired ingredient to 
                generate recipes with those ingredients.
            </p>
            <button onClick={onRequestClose}>Close</button> 
        </Modal>
    );
}

export default GettingStartedModal;
