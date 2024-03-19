// all packages:
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import colors from 'colors';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import userrouter from './routes/userRoute.js';
import productrouter from './routes/productRoute.js';
import categoryrouter from './routes/categoryRoute.js';
import orderrouter from './routes/orderRoute.js';
import errorHandler from './middlewares/errorHandler.js';
import Stripe from 'stripe';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

// all middlewares:
const app = express();
dotenv.config();
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser());

// database connection:
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to database...");
}).catch((err) => {
    console.log(err);
})


// Stripe payment config:
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// cloudinary config:
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET
});


// all routes:
app.use('/api/user', userrouter);
app.use('/api/product', productrouter);
app.use('/api/category', categoryrouter);
app.use('/api/order', orderrouter);


// Error handlers:
app.use(errorHandler);

// App Port:
app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port ${process.env.APP_PORT}`.bgMagenta);
})