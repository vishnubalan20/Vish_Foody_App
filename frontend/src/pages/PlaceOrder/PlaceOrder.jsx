import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {QRCodeSVG, QRCodeCanvas} from 'qrcode.react';  // Correct import for QRCode

const PlaceOrder = () => {
    const location = useLocation();
    const { finalTotal, discount } = location.state || {}; 
    const [platformFee, setPlatformFee] = useState(0);
    const [payment, setPayment] = useState("cod");
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency, deliveryCharge } = useContext(StoreContext);
    const navigate = useNavigate();

    const generateOrderId = () => {
        const timestamp = Date.now().toString().slice(-5); // Last 5 digits of the timestamp
        const randomString = Math.random().toString(36).substring(2, 6).toUpperCase(); // Random 4-character string
        return `ORD${timestamp}${randomString}`; // Combining both
    }

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const placeOrder = async (e) => {
        if(payment!=="qr") {
            e.preventDefault();
        }
        let orderItems = [];
        food_list.map(((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        }));
        
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge,
            orderId: generateOrderId(),
        }
        if (payment === "stripe") {
            orderData.amountPaid = 'Paid';
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url);
            } else {
                toast.error("Something Went Wrong");
            }
        } else if (payment === "cod" || payment ==="qr") {
            if(payment === "cod" ){
                orderData.amountPaid = 'Un paid';
            }
            if(payment === "qr" ){
                orderData.amountPaid = 'Paid';
            }
            let response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } });
            if (response.data.success) {
                navigate("/myorders");
                toast.success(response.data.message);
                setCartItems({});
            } else {
                toast.error("Something Went Wrong");
            }
        }
    }

    useEffect(() => {
        if (!token) {
            toast.error("To place an order, sign in first");
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token]);

    useEffect(()=>{
        if(payment === "qr") {
            setTimeout(placeOrder, 15000);
        }
    },[payment]);

    // Render Coupon Message based on finalTotal
    const renderCouponMessage = () => {
        if (finalTotal > 2000) {
            return <p className="coupon-message">Use Coupon Code <strong>DISCOUNT50</strong> for a 50% discount on your next order!</p>;
        } else if (finalTotal > 1000) {
            return <p className="coupon-message">Use Coupon Code <strong>DISCOUNT20</strong> for a 20% discount on your next order!</p>;
        } else if (finalTotal > 500) {
            return <p className="coupon-message">Use Coupon Code <strong>DISCOUNT10</strong> for a 10% discount on your next order!</p>;
        }
        return null;
    };

    // Generate the payment QR Code with the necessary order info
    const generatePaymentQR = () => {
        const paymentData = {
            amount: finalTotal,
            orderId: generateOrderId()
        };
        return JSON.stringify(paymentData); // Convert payment data to string
    };

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
                <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
                <div className="multi-field">
                    <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required />
                    <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required />
                </div>
                <div className="multi-field">
                    <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
                    <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
                </div>
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{finalTotal}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Platform Fee</p><p>{currency}{platformFee}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{finalTotal + platformFee}</b></div>
                    </div>
                </div>
                <br/>
                {/* Display Coupon Message */}
                {renderCouponMessage()}

                {/* Display QR Code for payment */}
                {payment === "qr" && (
                    <div className="qr-code-payment">
                        <h3>Scan and Pay</h3>
                        <QRCodeSVG value={generatePaymentQR()} size={256} />
                        <p>Scan this QR code to complete your payment.</p>
                    </div>
                )}

                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => {
                        setPlatformFee(0);
                        setPayment("cod");
                    }} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD (Cash on Delivery)</p>
                    </div>
                    <div onClick={() => {
                        setPayment("stripe");
                        setPlatformFee(10);
                    }} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>Stripe (Credit/Debit)</p>
                    </div>
                    <div onClick={() => {
                        setPayment("qr");
                        setPlatformFee(0);
                    }} className="payment-option">
                        <img src={payment === "qr" ? assets.checked : assets.un_checked} alt="" />
                        <p>QR Code (Scan and Pay)</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>{payment === "cod" ? "Place Order" : "Proceed To Payment"}</button>
            </div>
        </form>
    );
};

export default PlaceOrder;
