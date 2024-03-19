import mongoose from "mongoose";

// Review:
const reviewSchema = new mongoose.Schema({
    name: { type: String, required: [true, "name is required"] },
    rating: { type: Number, default: 0 },
    commet: { type: String },
    reviewCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, "User is required"] }
}, { timestamps: true });

// Product:
const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, "product name is required"] },
    description: { type: String, required: [true, "product description is required"] },
    price: { type: Number, required: [true, "product price is required"] },
    stock: { type: Number, required: [true, "product stock is required"] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, "User already exists"] },
    images: [
        {
            public_id: String,
            url: String
        }
    ],
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('product', productSchema);