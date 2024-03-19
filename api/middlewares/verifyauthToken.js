import Jwt from "jsonwebtoken";
import User from "../models/User.js";

// user access token:
export const verifyauthToken = async (req, res, next) => {
    try {
        const { accessToken } = req.cookies;

        // Validation:
        if (!accessToken) {
            return next('Unauthorized User...');
        }

        const tokendecode = Jwt.verify(accessToken, process.env.JWT_KEY);

        req.user = await User.findById(tokendecode._id);

        next();
    }
    catch (err) {
        return next('Unauthorized User...');
    }
}


// Admin user:
export const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return next("Admin only...");
        }
        next();
    }
    catch (error) {
        return next(error.message || "Unathorized User...");
    }
}