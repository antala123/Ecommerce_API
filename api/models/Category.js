import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category: { type: String, required: [true, "category is required"] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, "User already exists"] }
}, { timestamps: true });

export default mongoose.model('category', categorySchema);