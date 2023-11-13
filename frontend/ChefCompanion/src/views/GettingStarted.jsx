import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

/* eslint react/prop-types: 0 */
function GettingStartedModal({ isOpen, onRequestClose }) {
    // Define custom styles for the modal
    const modalStyles = {
        content: {
            maxWidth: '400px', 
            maxHeight: '300px', 
            margin: 'auto',    
            textAlign: 'center',
        },
    };

    return (
        // Create the modal component
        <Modal
            isOpen={isOpen}                 
            onRequestClose={onRequestClose} 
            contentLabel="Getting Started Modal"
            style={modalStyles}              
        >
            <h2>Getting Started</h2>  
            Test
            <p>
                Welcome to Chef Companion! Generate recipes based on what you have from your pantry and kitchen.
            </p>
            <button onClick={onRequestClose}>Close</button> 
        </Modal>
    );
}

export default GettingStartedModal;
