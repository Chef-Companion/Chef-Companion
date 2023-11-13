import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './views/HomePage';
import MainPage from './views/MainPage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './App.css';

function App() {

  return (
    <Router>
      <div className='App'>
        <NavBar /> 
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/main" element={<MainPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
