import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  const logout = () => {

  }
  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      <img className='profile' src={assets.profile_image} alt="" />
      <ul className='navbar-profile-dropdown'>
      <li onClick={logout}> <img src={assets.logout_icon} alt="" /> <p>Logout</p></li> 
      </ul>
    </div>
  )
}

export default Navbar
