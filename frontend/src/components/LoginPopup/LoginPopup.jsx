import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPopup = ({ setShowLogin }) => {
    const { setToken, url, loadCartData } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Sign Up");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({}); // Store validation errors
    const [serverError, setServerError] = useState(""); // Store backend password mismatch error

    const validateInputs = () => {
        let newErrors = {};

        if (currState === "Sign Up") {
            if (!data.name.trim()) newErrors.name = "Name is required.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) newErrors.email = "Invalid email format.";

        // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        // if (!passwordRegex.test(data.password)) {
        //     newErrors.password = "Password must be at least 6 characters and include at least 1 letter and 1 number.";
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error on input change
        setServerError(""); // Clear server error when user types
    };

    const onLogin = async (e) => {
        e.preventDefault();
        
        if (!validateInputs()) return; // Stop if validation fails

        let new_url = url + (currState === "Login" ? "/api/user/login" : "/api/user/register");

        try {
            const response = await axios.post(new_url, data);

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                loadCartData({ token: response.data.token });
                setShowLogin(false);
            } else {
                if (response.data.message.includes("Incorrect password")) {
                    setServerError("Incorrect password. Please try again.");
                } else {
                    toast.error(response.data.message);
                }
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
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <>
                            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />
                            {errors.name && <p className="error-text">{errors.name}</p>}
                        </>
                    )}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                    
                    <input 
                        name='password' 
                        onChange={onChangeHandler} 
                        value={data.password} 
                        type="password" 
                        placeholder='Password' 
                        required 
                        className={serverError ? "error-input" : ""}
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}
                    {serverError && <p className="error-text">{serverError}</p>}
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
