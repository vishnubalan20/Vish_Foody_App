import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { listOrders, placeOrder,updateStatus,userOrders, verifyOrder, placeOrderCod, submitFeedbackRating, getFeedbackRating } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.get("/list",listOrders);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/status",updateStatus);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/placecod",authMiddleware,placeOrderCod);
orderRouter.post("/feedback",authMiddleware,submitFeedbackRating);
orderRouter.post("/get_feedback",authMiddleware,getFeedbackRating);

export default orderRouter;