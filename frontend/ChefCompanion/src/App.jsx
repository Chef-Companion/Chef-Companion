import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './views/HomePage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './App.css';
import { useEffect, useState } from 'react';
import SearchPanel from './pages/landing';

function App() {
  const [backend, setBackend] = useState(false);

  useEffect(() => {
    fetch('/api')
      .then((response) => response.json())
      .then((data) => setBackend(data.working));
  }, []);

  return (
    <Router>
      <div className='App'>
        <NavBar /> 
        <Routes>
          <Route path="/" element={<HomePage />} /> 
        </Routes>
        <Footer />
        </div>
    </Router>
    <div>
      <SearchPanel/>
    </div>
  );
}

export default App;
