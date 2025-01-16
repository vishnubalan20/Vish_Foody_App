import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='topbar'>
      <div className="topbar-options">
        <NavLink to='/add' className="topbar-option">
            <img src={assets.add_icon} alt="Add" />
            <p>Add to menu</p>
        </NavLink>
        <NavLink to='/list' className="topbar-option">
            <img src={assets.order_icon} alt="List" />
            <p>Show menu</p>
        </NavLink>
        <NavLink to='/orders' className="topbar-option">
            <img src={assets.order_icon} alt="Orders" />
            <p>Track orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar;
