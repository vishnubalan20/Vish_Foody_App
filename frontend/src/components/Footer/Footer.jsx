import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <p>Hey Foodys is a vibrant and contemporary restaurant that offers a unique dining experience, combining diverse cuisines with a cozy atmosphere. The restaurant focuses on serving high-quality, freshly prepared dishes made from locally sourced ingredients. With an emphasis on exceptional customer service, Hey Foodys ensures every meal is an unforgettable experience for all its guests</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
            <li>+91 9600066464</li>
            <li>heyfoodys136@gmail.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 © HeyFoodys.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
