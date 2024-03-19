import { stripe } from "../index.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";



// Create a new Order:
export const CreateOrder = async (req, res, next) => {
    try {
        const { shippinginfo, orderitems,
            paymentmethod, paymentinfo,
            itemprice, tax,
            shippingcharges, totalamount } = req.body;

        // validate:
        // if (!shippinginfo || !orderitems || !paymentmethod || !itemprice || !tax ||
        //     !shippingcharges || !totalamount) {
        //     return next("Please Provide all fields...");
        // }

        const createdBy = req.user._id;
        if (!createdBy) {
            return next("User Unauthorized...");
        }

        // create order:
        const orderData = await Order.create({
            createdBy, shippinginfo,
            orderitems, paymentmethod,
            paymentinfo, itemprice,
            tax, shippingcharges,
            totalamount
        })

        // Stock Update:
        for (let i = 0; i < orderitems.length; i++) {
            const productStock = await Product.findById(orderitems[i].product);
            if (!productStock) {
                return next(`Product not found with id ${orderitems[i].product}`);
            }
            productStock.stock -= orderitems[i].quantity;
            await productStock.save();
        }

        res.status(201).json({ message: "Order Created Successfully...", order: orderData });
    }
    catch (error) {
        return next(error.message || "please check user authorized...");
    }
}

// Get All Order:
export const getAllOrder = async (req, res, next) => {
    try {
        // find all orders:
        const allorder = await Order.find({ createdBy: req.user._id });
        if (!allorder) {
            return next("Order not found...");
        }

        res.status(200).json({ message: "All Orders Show...", totalOrders: allorder.length, order: allorder });
    }
    catch (error) {
        return next(error.message || "order not found...");
    }
}

// Get Single Order:
export const getSingleOrder = async (req, res, next) => {
    try {
        // find all orders:
        const Singleorder = await Order.findById(req.params.id);
        if (!Singleorder) {
            return next("Order not found...");
        }

        res.status(200).json({ message: "Orders Show...", order: Singleorder });
    }
    catch (error) {
        return next(error.message || "order not found...");
    }
}

// Accept Payment:
export const Paymentorder = async (req, res, next) => {
    try {
        // get amount:
        const { totalamount } = req.body;
        if (!totalamount) {
            return next("total amount is required...");
        }

        const { client_secret } = await stripe.paymentIntents.create({
            amount: Number(totalamount * 100),
            currency: "inr"
        });

        res.status(200).json({ payment: client_secret });

    }
    catch (error) {
        return next(error.message || "order payment error...");
    }
}

// Change Order Status:
export const Statusorder = async (req, res, next) => {
    try {
        // find order:
        const orderStatusData = await Order.findById(req.params.id);
        if (!orderStatusData) {
            return next("Order not found...");
        }

        // change status condition:
        if (orderStatusData.orderstatus === "Processing") {
            orderStatusData.orderstatus = "Shipped";
        }
        else if (orderStatusData.orderstatus === "Shipped") {
            orderStatusData.orderstatus = "Deliverd";
            orderStatusData.deliverdAt = Date.now();
        }
        else {
            return next("Order Already Deliverd...");
        }

        await orderStatusData.save();
        res.status(200).json({ message: "Order Status updated Successfully...", order: orderStatusData });
    }
    catch (error) {
        return next(error.message || "order not found...");
    }
}

//  Cancel order:
export const Cancelorder = async (req, res, next) => {
    try {
        // find order:
        const ordercancelData = await Order.findById({ _id: req.params.id, createdBy: req.user._id });
        if (!ordercancelData) {
            return next("Order not found...");
        }

        // Stock Update:
        for (let i = 0; i < ordercancelData.orderitems.length; i++) {
            const productStock = await Product.findById(ordercancelData.orderitems[i].product);
            if (!productStock) {
                return next(`Product not found with id ${ordercancelData.orderitems[i].product}`);
            }
            productStock.stock += ordercancelData.orderitems[i].quantity;
            await productStock.save();
        }

        await ordercancelData.deleteOne();
        res.status(200).json({ message: "Order Cancelled Successfully...", order: ordercancelData });
    }
    catch (error) {
        return next(error.message || "order not found...");
    }
}