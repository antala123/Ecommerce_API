import mongoose from "mongoose";
import Jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "name is required"] },
    email: { type: String, required: [true, "email is required"], unique: [true, "email already exists"] },
    password: { type: String, required: [true, "password is required"] },
    address: { type: String, required: [true, "address is required"] },
    city: { type: String, required: [true, "city name is required"] },
    country: { type: String, required: [true, "country name is required"] },
    phone: { type: Number, required: [true, "phone no is required"] },
    profilepic: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    answer: { type: String, required: [true, "answer is required"] },
    role: { type: String, enum: ["admin", "user"], default: "user" }
}, { timestamps: true });

// Create JWT Token:
userSchema.methods.createJWT = function () {
    return Jwt.sign({ _id: this._id }, process.env.JWT_KEY, { expiresIn: process.env.ACCESS_LIMIT });
}

export default mongoose.model('user', userSchema);