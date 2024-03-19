import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    shippinginfo: {
        address: { type: String, required: [true, "address is required..."] },
        city: { type: String, required: [true, "city name is required..."] },
        country: { type: String, required: [true, "country name is required..."] }
    },
    orderitems: [{
        name: { type: String, required: [true, "product name is required..."] },
        price: { type: Number, required: [true, "product price is required..."] },
        quantity: { type: Number, required: [true, "product quantity is required..."] },
        image: { type: Array, required: [true, "product image is required..."] },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
    }],
    paymentmethod: { type: String, enum: ["Cash On Delivery", "Online Payment"], default: "Cash On Delivery" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, "user id is required..."] },
    paidAt: Date,
    paymentinfo: { id: String, status: String },
    itemprice: { type: Number, required: [true, "item price is required..."] },
    tax: { type: Number, required: [true, "tax price is required..."] },
    shippingcharges: { type: Number, required: [true, "item shippingcharges is required..."] },
    totalamount: { type: Number, required: [true, "item totalamount is required..."] },
    orderstatus: { type: String, enum: ["Processing", "Shipped", "Deliverd"], default: "Processing" },
    deliverdAt: Date

}, { timestamps: true });

export default mongoose.model('order', orderSchema);