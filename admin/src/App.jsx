import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPopup from './components/LoginPopup/LoginPopup.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import { BrowserRouter } from 'react-router-dom'

function App() {
    const [showLogin, setShowLogin] = useState(true); // State to control LoginPopup visibility

    return (

            <Routes>
                {/* Default route points to LoginPopup */}
                <Route
                    path="/"
                    element={showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <Navigate to="/dashboard" />}
                />
                {/* Other routes */}
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>

    );
}

export default App;
