import Category from "../models/Category.js";
import Product from "../models/Product.js";


// create a new Category:
export const createCategory = async (req, res, next) => {
    try {
        const { category } = req.body;
        if (!category) {
            return next("Please Provide Category name...");
        }

        const createdBy = req.user._id;
        if (!createdBy) {
            return next("User Unauthorized...");
        }

        const catData = await Category.create({ category, createdBy });

        res.status(201).json({ message: "Category created successfully", catData });
    }
    catch (error) {
        return next(error.message || "Please check user authorized...");
    }
}

// Get All Category:
export const getAllCategory = async (req, res, next) => {
    try {
        const catAllData = await Category.find({ createdBy: req.user._id });

        res.status(201).json({ message: "All Category Show...", totalData: catAllData.length, catAllData });
    }
    catch (error) {
        return next(error.message || "Category not found...");
    }
}

// Update Category:
export const UpdateCategory = async (req, res, next) => {
    try {
        const categoryupdateData = await Category.findById({ _id: req.params.id, createdBy: req.user._id });
        if (!categoryupdateData) {
            return next("Category not found...");
        }

        // Update:
        const { category } = req.body;
        if (!category) {
            return next("Please Provide Category name...");
        }

        // find product with category id:
        const productUpData = await Product.find({ category: categoryupdateData._id });

        for (let i = 0; i < productUpData.length; i++) {
            const productdata = productUpData[i];
            productdata.category = category;
            await productdata.save();
        }

        if (category) {
            categoryupdateData.category = category;
        }

        await categoryupdateData.save();

        res.status(201).json({ message: "Category Update Successfully...", categoryupdateData });
    }
    catch (error) {
        return next(error.message || "Category not found...");
    }
}

// Delete Category:
export const DeleteCategory = async (req, res, next) => {
    try {
        const categorydelData = await Category.findById({ _id: req.params.id, createdBy: req.user._id });
        if (!categorydelData) {
            return next("Category not found...");
        }

        // find product with category id:
        const productDelData = await Product.find({ category: categorydelData._id });

        for (let i = 0; i < productDelData.length; i++) {
            const productdata = productDelData[i];
            productdata.category = undefined;
            await productdata.save();
        }

        await categorydelData.deleteOne();

        res.status(201).json({ message: "Category Deleted Successfully...", categorydelData });
    }
    catch (error) {
        return next(error.message || "Category not found...");
    }
}