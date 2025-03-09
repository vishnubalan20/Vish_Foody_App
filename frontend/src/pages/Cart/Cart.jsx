import React, { useContext, useState } from "react";
import './Cart.css';
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, currency, deliveryCharge } = useContext(StoreContext);
    const [promoCode, setPromoCode] = useState(""); // Store promo code input
    const [discount, setDiscount] = useState(0); // Discount percentage
    const navigate = useNavigate();

    // Function to handle promo code input and apply discount
    const handlePromoCode = () => {
        // Check for valid promo codes
        if (promoCode === "DISCOUNT10") {
            setDiscount(10); // Apply 10% discount
        } else if (promoCode === "DISCOUNT50") {
            setDiscount(50); // Apply 50% discount
        } else {
            setDiscount(0); // No discount for invalid code
            alert("Invalid promo code");
        }
    };

    // Calculate the discounted total amount
    const discountedTotal = getTotalCartAmount() - (getTotalCartAmount() * (discount / 100));
    const finalTotal = discountedTotal + deliveryCharge;

    const handleProceedToCheckout = () => {
        // Pass discount and final total to the checkout page
        navigate("/order", { state: { finalTotal, discount } });
    };

    return (
        <div className="cart">
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Items</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <br />
                <hr />
                {food_list.map((item, index) => {
                    if (cartItems[item._id] > 0) {
                        return (
                            <div key={index}>
                                <div className="cart-items-title cart-items-item">
                                    <img src={url + "/images/" + item.image} alt="" />
                                    <p>{item.name}</p>
                                    <p>{currency}{item.price}</p>
                                    <div>{cartItems[item._id]}</div>
                                    <p>{currency}{item.price * cartItems[item._id]}</p>
                                    <p className="cart-items-remove-icon" onClick={() => removeFromCart(item._id)}>x</p>
                                </div>
                                <hr />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            <div className="cart-bottom">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p></div>
                        <hr />
                        {/* Display Discounted Total */}
                        <div className="cart-total-details">
                            <p>Discount</p>
                            <p>{discount}%</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b><b>{currency}{finalTotal}</b>
                        </div>
                    </div>
                    <button onClick={handleProceedToCheckout}>PROCEED TO CHECKOUT</button>
                </div>

                <div className="cart-promocode">
                    <div>
                        <p>If you have a promo code, Enter it here</p>
                        <div className="cart-promocode-input">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="promo code"
                            />
                            <button onClick={handlePromoCode}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
