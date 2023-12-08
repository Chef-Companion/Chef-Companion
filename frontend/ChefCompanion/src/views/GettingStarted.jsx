import Modal from "react-modal";

// Set the app element for accessibility
Modal.setAppElement("#root");

/* eslint react/prop-types: 0 */
function GettingStartedModal({ isOpen, onRequestClose }) {
  // Define custom styles for the modal
  const modalStyles = {
    content: {
      maxWidth: "600px",
      maxHeight: "300px",
      margin: "auto",
      textAlign: "center",
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
      <p>
        Welcome to Chef Companion! Generate recipes based on what you have from
        your pantry and kitchen.
      </p>
      <p>
        Add ingredients from the search bar to your list, and click the checkbox
        for them to be selected in your recipe search.
      </p>
      <p>
        When you are ready to search for recipes, click the &quot;Generate
        Recipes&quot; button to view the list of recipes which contain the
        ingredients you have checked off.
      </p>
      <p>
        To view a recipe, click on it to open a side panel displaying the
        ingredients and instructions.
      </p>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
}

export default GettingStartedModal;
