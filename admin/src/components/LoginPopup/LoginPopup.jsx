import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPopup = ({ setShowLogin }) => {
    const url = "http://localhost:4000";
    const [currState, setCurrState] = useState("Sign Up");

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        admincode: ""
    });

    const [error, setError] = useState("");

    const correctAdminCode = "ADMIN005"; // Replace with the actual admin code

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onLogin = async (e) => {
        e.preventDefault();
        
        if (currState === "Sign Up" && data.admincode !== correctAdminCode) {
            setError("Invalid Admin Code! Please enter the correct one.");
            return;
        }

        setError(""); // Clear any previous error messages

        let new_url = url + (currState === "Login" ? "/api/user/login" : "/api/user/register");

        try {
            const response = await axios.post(new_url, data);

            if (response.data.success) {
                setShowLogin(false);
                console.log("Sign up successful");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2> 
                  
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <>
                            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />
                            <input name='admincode' onChange={onChangeHandler} value={data.admincode} type="text" placeholder='Admin code' required />
                            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error if admin code is incorrect */}
                        </>
                    )}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                <button type="submit">{currState === "Login" ? "Login" : "Create account"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                }
            </form>
        </div>
    );
};

export default LoginPopup;
