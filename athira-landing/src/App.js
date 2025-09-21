import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import RegisterForm from './components/RegisterForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
