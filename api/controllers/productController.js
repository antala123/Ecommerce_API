import cloudinary from 'cloudinary';
import { getDataUri } from '../utils/features.js';
import Product from '../models/Product.js';

// Create a new Product:
export const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, stock } = req.body;

        const createdBy = req.user._id;

        // if (!name || !description || !price || !stock) {
        //     return next("Please Provide all fields...");
        // }

        //product images:
        // if (!req.file) {
        //     return next("Please provide Images...");
        // }

        // const filedata = getDataUri(req.file);
        // const proimage = await cloudinary.v2.uploader.upload(filedata.content);
        // const Image = {
        //     public_id: proimage.public_id,
        //     url: proimage.secure_url
        // }

        //product images:
        if (!req.files || req.files.length === 0) {
            return next("Please provide Images...");
        }

        const images = [];
        for (const file of req.files) {
            const filedata = getDataUri(file);
            const proimage = await cloudinary.v2.uploader.upload(filedata.content);
            const Image = {
                public_id: proimage.public_id,
                url: proimage.secure_url
            }
            images.push(Image);
        }

        const productData = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            createdBy,
            images
        });

        res.status(201).json({ message: "Product Created Successfully...", productData });
    }
    catch (error) {
        return next(error.message || "User not found...");
    }
}

// Get All Product:
export const getAllProduct = async (req, res, next) => {

    const { keyword } = req.query;
    try {
        const getproduct = await Product.find({
            createdBy: req.user._id,
            name: {
                $regex: keyword ? keyword : "",
                $options: 'i'
            }
        });

        if (!getproduct) {
            return next("Product not found...");
        }

        res.status(200).json({ message: "All Products Found...", TotalItem: getproduct.length, Data: getproduct });
    }
    catch (error) {
        return next(error.message || "Product not found...");
    }
}

// Get Top Product:
export const getTopProduct = async (req, res, next) => {
    try {
        const proTopData = await Product.find({ createdBy: req.user._id }).sort({ rating: -1 }).limit(3);

        res.status(200).json({ message: "Top 3 Products...", TotalItem: proTopData.length, Data: proTopData });
    }
    catch (error) {
        return next(error.message || "Product not found...");
    }
}

// Get Single Product:
export const getSingleProduct = async (req, res, next) => {
    try {
        const singleproduct = await Product.findById({ _id: req.params.id, createdBy: req.user._id });

        res.status(200).json({ message: "All Products Found...", singleproduct });
    }
    catch (error) {
        return next(error.message || "Product not found...");
    }
}

// Update Product:
export const UpdateProduct = async (req, res, next) => {
    try {
        // find product:
        const productdata = await Product.findById({ _id: req.params.id, createdBy: req.user._id });
        if (!productdata) {
            return next("Product not found...");
        }
        // update product:
        const { name, description, price, stock, category } = req.body;

        // validate product:
        if (name) productdata.name = name
        if (description) productdata.description = description
        if (price) productdata.price = price
        if (stock) productdata.stock = stock
        if (category) productdata.category = category

        await productdata.save();

        res.status(200).json({ message: "Product Updated Successfully...", productdata });
    }
    catch (error) {
        return next(error.message || "Product not found...");
    }
}

// Update Images Product:
export const UpdateImagesProduct = async (req, res, next) => {
    try {
        // find product:
        const productUpimagesdata = await Product.findById({ _id: req.params.id, createdBy: req.user._id });
        if (!productUpimagesdata) {
            return next("Product not found...");
        }

        // product images:
        if (!req.files || !req.files.length === 0) {
            return next("Please provide Images...");
        }

        const images = [];
        for (const file of req.files) {
            const imgfileData = getDataUri(file);
            const dataimages = await cloudinary.v2.uploader.upload(imgfileData.content);
            const Imagedata = {
                public_id: dataimages.public_id,
                url: dataimages.secure_url
            }
            images.push(Imagedata);
        }

        productUpimagesdata.images = images;

        await productUpimagesdata.save();

        res.status(200).json({ message: "Product Images Updated Successfully...", productUpimagesdata });
    }
    catch (error) {
        return next(error.message || "Product not found...");
    }
}

// Delete Images Product:
export const DeleteImagesProduct = async (req, res, next) => {
    try {
        // find product:
        const productdelimagesdata = await Product.findById({ _id: req.params.id, createdBy: req.user._id });
        if (!productdelimagesdata) {
            return next("Product not found...");
        }

        // find images id:
        const id = req.query.id;
        if (!id) {
            return next("Product images not found...");
        }

        let isindex = -1;
        productdelimagesdata.images.forEach((item, index) => {
            if (item._id.toString() === id.toString()) {
                isindex = index;
            }
        })
        if (isindex < 0) {
            return next("images not found...");
        }

        // delete Images:
        await cloudinary.v2.uploader.destroy(productdelimagesdata.images[isindex].public_id);
        productdelimagesdata.images.splice(isindex, 1);

        await productdelimagesdata.save();

        res.status(200).json({ message: "Product Images Deleted Successfully...", productdelimagesdata });
    }
    catch (error) {
        return next(error.message || "Product not found...");
    }
}

// Delete Product:
export const DeleteProduct = async (req, res, next) => {
    try {
        // find product:
        const productdeldata = await Product.findById({ _id: req.params.id, createdBy: req.user._id });
        if (!productdeldata) {
            return next("Product not found...");
        }

        for (let index = 0; index < productdeldata.images.length; index++) {
            await cloudinary.v2.uploader.destroy(productdeldata.images[index].public_id);
        }

        await productdeldata.deleteOne();

        res.status(200).json({ message: "Product Deleted Successfully...", productdeldata });
    }
    catch (error) {
        return next(error.message || "Product not found...");
    }
}

// Review Product:
export const ReviewProduct = async (req, res, next) => {
    try {
        const { commet, rating } = req.body;

        //find the product:
        const productdata = await Product.findById(req.params.id);
        // check previous rating:
        const alreadyreviewed = productdata.reviews.find((r) => r.user.toString() === req.user._id.toString());
        if (alreadyreviewed) {
            return next("Product Already Reviewed...");
        }

        // review object:
        const review = {
            name: req.user.name,
            rating: Number(rating),
            commet,
            reviewCreatedBy: req.user._id
        }

        // review object to reviews Array push:
        productdata.reviews.push(review);
        // number of reviews count:
        productdata.numReviews = productdata.reviews.length;

        // calculation review:
        productdata.rating = productdata.reviews.reduce((acc, item) => item.rating + acc, 0) / productdata.reviews.length;

        await productdata.save();

        res.status(200).json({ message: "Reviewed Added Successfully...", productdata });
    }
    catch (error) {
        return next(error.message || "Product Review Error...");
    }
}