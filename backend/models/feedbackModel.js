import mongoose from "mongoose";

const feedbackScheme = new mongoose.Schema({
    orderId: { type: String, required: true },
    rating: { type: Number, required: true },
    feedback: { type: String, required: true}
})

const feedbackModel = mongoose.models.feedback || mongoose.model("feedback", feedbackScheme);
export default feedbackModel;