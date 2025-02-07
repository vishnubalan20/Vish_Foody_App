import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'


const Navbar = ({
  showLogin, setShowLogin
} ) => {
  const navigate = useNavigate();

  const logout = () => {
    setShowLogin(true);
  }
  return (

    <div className='navbar'>
    <img className='logo' src={assets.logo} alt="" />
    <div className='navbar-profile'>
    <img src={assets.profile_image} alt="" />
    <ul className='navbar-profile-dropdown'>
    <li onClick={logout}> <img src={assets.logout_icon} alt="" /> <p>Logout</p></li> 
    </ul>
    </div>
  </div>



  )
}

export default Navbar
