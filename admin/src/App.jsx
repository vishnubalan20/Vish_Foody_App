import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPopup from './components/LoginPopup/LoginPopup.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import List from './pages/List/List.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Navbar from './components/Navbar/Navbar'
import Add from './pages/Add/Add'
import Orders from './pages/Orders/Orders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <Router>
            {showLogin ? (
                <LoginPopup setShowLogin={setShowLogin} />
            ) : (
                <div className='app'>
                <ToastContainer />
                <Navbar showLogin={showLogin} setShowLogin={setShowLogin} />
                <hr />
                <div className="app-content">
                  <Sidebar />
                  <Routes>
                    <Route path="/add" element={<Add />} />
                    <Route path="/list" element={<List />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </div>
              </div>
            )}
        </Router>
    );
}

export default App;
