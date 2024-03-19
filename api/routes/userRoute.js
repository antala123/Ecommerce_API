import express from 'express';
import { Forgotpassword, Login, Logout, Register, Update, Updateimage } from '../controllers/userController.js';
import { verifyauthToken } from '../middlewares/verifyauthToken.js';
import { imageUpload } from '../middlewares/profilemulter.js';



const router = express.Router();

// Register:
router.post('/create', imageUpload.single("files", 1), Register);
// Login:
router.post('/login', Login);
// Logout:
router.get('/logout', verifyauthToken, Logout);
// Profile Update:
router.put('/update', verifyauthToken, Update);
// Profile image Update:
router.put('/image', verifyauthToken, imageUpload.single("files", 1), Updateimage);
// Forgot Password:
router.post('/forgot', Forgotpassword);

export default router;