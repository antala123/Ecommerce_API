import User from "../models/User.js";
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import { getDataUri } from '../utils/features.js';

// Register a new user:
export const Register = async (req, res, next) => {
    try {
        const { name, email, password, address, city, country, phone, answer, role } = req.body;

        // Validate:
        if (!name || !email || !password || !address || !city || !country || !phone || !answer || !role) {
            return next('Please fill all the fields...');
        }

        // Validate Email:
        const emailcheck = await User.findOne({ email });
        if (emailcheck) {
            return next('Email Already Registered, Please Login...');
        }

        // Hash Password:
        const Hashpassword = await bcrypt.hash(password, 10);

        // Check if req.file exists
        if (!req.file) {
            return next('No file found in request');
        }

        const file = getDataUri(req.file);

        // Upload image to Cloudinary:
        const uploadedData = await cloudinary.v2.uploader.upload(file.content);



        const userData = await User.create({
            name,
            email,
            password: Hashpassword,
            address,
            city,
            country,
            phone,
            profilepic: {
                public_id: uploadedData.public_id,
                url: uploadedData.secure_url
            },
            answer,
            role
        })


        res.status(201).json({
            message: 'User Registered Successfully, Please Login...', userData
        })
    }
    catch (error) {
        return next(error.message || 'Error In Register API...');
    }
}

//  Login user:
export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate:
        if (!email || !password) {
            return next('Please fill User Email and Password...');
        }

        // Validate Email:
        const emailcheck = await User.findOne({ email });
        if (!emailcheck) {
            return next('Invalid User Email...');
        }

        // Check Password:
        const isMatch = await bcrypt.compare(password, emailcheck.password);
        if (!isMatch) {
            return next('Invalid User Password...');
        }

        // Generate Token:
        const Accesstoken = emailcheck.createJWT();

        res.cookie("accessToken", Accesstoken, { httpOnly: false })
            .status(200)
            .json({ message: 'User Login Successfully...', Accesstoken: Accesstoken, emailcheck });
    }
    catch (error) {
        return next('User Data Not Found...');
    }
}

//  Logout user:
export const Logout = async (req, res, next) => {
    try {
        res.status(200).clearCookie('accessToken').json({ message: 'User Logout Successfully...' });
    }
    catch (error) {
        return next('User Data Not Found...');
    }
}


// Update user:
export const Update = async (req, res, next) => {
    try {
        const { name, email, password, address, city, country, phone, role } = req.body;
        const userUpdata = await User.findById(req.user._id);

        if (!userUpdata) {
            return next('User not found...');
        }

        if (name) userUpdata.name = name;
        if (email) userUpdata.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            userUpdata.password = hashedPassword;
        }
        if (address) userUpdata.address = address;
        if (city) userUpdata.city = city;
        if (country) userUpdata.country = country;
        if (phone) userUpdata.phone = phone;
        if (role) userUpdata.role = role;

        await userUpdata.save();
        res.status(200).json({ message: 'User Updated Successfully...', userUpdata });
    }
    catch (error) {
        return next('User Data Not Found...');
    }
}

// Update image user:
export const Updateimage = async (req, res, next) => {
    try {

        // Check if req.file exists
        if (!req.file) {
            throw new Error('No file found in request');
        }

        const userdata = await User.findById(req.user._id);

        const file = getDataUri(req.file);

        // file delete:
        await cloudinary.v2.uploader.destroy(userdata.profilepic.public_id);

        // Update:
        const updatedata = await cloudinary.v2.uploader.upload(file.content);
        userdata.profilepic = {
            public_id: updatedata.public_id,
            url: updatedata.secure_url
        }

        await userdata.save();

        res.status(200).json({ message: 'User Image Updated Successfully...', userdata });

    }
    catch (error) {
        return next(error.message || 'User Image Not Found...');
    }
}

// Forgot Password:
export const Forgotpassword = async (req, res, next) => {
    try {
        // Get email || new-password || answer:
        const { email, newpassword, answer } = req.body;
        if (!email || !newpassword || !answer) {
            return next("Please Provide All Fields...");
        }

        // find user:
        const checkuser = await User.findOne({ email, answer });
        if (!checkuser) {
            return next('Invalid user and answer...');
        }

        const newpasswordHash = await bcrypt.hash(newpassword, 10);

        checkuser.password = newpasswordHash;
        await checkuser.save();
        res.status(200).json({ message: 'Your Password Reset Successfully,Please Login...', checkuser });
    }
    catch (error) {
        return next(error.message || 'User Not Found...');
    }
}
