import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './views/HomePage'; // Importing the HomePage component
import MainPage from './views/MainPage'; // Importing the MainPage component
import NavBar from './components/NavBar'; // Importing the NavBar component
import Footer from './components/Footer'; // Importing the Footer component
import './App.css'; // Importing the CSS file for styling

// App component
function App() {
  // State to check if the backend is working
  const [backend, setBackend] = useState(false);

  // useEffect to check the backend status on component mount
  useEffect(() => {
    fetch('/api')
      .then((response) => response.json())
      .then((data) => setBackend(data.working));
  }, []);

  return (
    <Router>
      <div className='App'>
        {/* NavBar component */}
        <NavBar />
        
        {/* Routes for different pages */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
        
        {/* Footer component */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
