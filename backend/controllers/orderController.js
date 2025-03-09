import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import feedbackModel from "../models/feedbackModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//config variables
const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = 'http://localhost:5173';



// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {
    debugger;
console.log(req.body);
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            orderId: req.body.orderId
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Placing User Order for Frontend using stripe
const placeOrderCod = async (req, res) => {

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
            orderId: req.body.orderId
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const updateStatus = async (req, res) => {
    debugger;
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }

}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        res.json({ success: false, message: "Not  Verified" })
    }

}

const submitFeedbackRating = async (req,res) => {

    {
        try {
          // Extract feedback data from the request body
          const { orderId, rating, feedback, foodName } = req.body;
      
          // Create a new feedback document
          const newFeedback = new feedbackModel({
            orderId,
            rating,
            feedback,
            foodName
          });
      
          // Save the new feedback document to MongoDB
          const savedFeedback = await newFeedback.save();
      
          // Respond with the saved feedback
          res.status(201).json({
            message: 'success',
            feedback: savedFeedback
          });
        } catch (error) {
          // Handle errors if saving the feedback fails
          console.error('Error saving feedback:', error);
          res.status(500).json({ message: 'error', error });
        }
      }

}


const getFeedbackRating =  async (req,res) => {
    try {
        // Extract orderId from the URL params
        const { orderId } = req.body;
    
        // Find the feedback document(s) associated with the orderId
        const feedback = await feedbackModel.findOne({ orderId });
    
        if (!feedback) {
          return res.status(404).json({ message: 'Feedback not found for this orderId' });
        }
    
        // Return the feedback including the rating
        return res.status(200).json({
          message: 'Feedback found',
          feedback: {
            orderId: feedback.orderId,
            rating: feedback.rating,
            feedbackText: feedback.feedback,
          },
        });
      } catch (error) {
        console.error('Error retrieving feedback:', error);
        res.status(500).json({ message: 'Error retrieving feedback', error });
      }
}

const getRatingForFood =  async (req,res) => {
    try {
        // Extract orderId from the URL params
        const { name } = req.body;
    
        // Find the feedback document(s) associated with the orderId
        const rating = await feedbackModel.findOne({ foodName: name });
    
        if (!rating) {
          return res.status(404).json({ message: 'Rating not found for this food name' });
        }
    
        // Return the feedback including the rating
        return res.status(200).json({
          message: 'Rating found',
          rating: rating.rating,
        });
      } catch (error) {
        console.error('Error retrieving rating:', error);
        res.status(500).json({ message: 'Error retrieving rating', error });
      }
}


export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod, submitFeedbackRating, getFeedbackRating , getRatingForFood}