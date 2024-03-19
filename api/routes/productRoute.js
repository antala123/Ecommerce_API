import express from 'express';
import { DeleteImagesProduct, DeleteProduct, ReviewProduct, UpdateImagesProduct, UpdateProduct, createProduct, getAllProduct, getSingleProduct, getTopProduct } from '../controllers/productController.js';
import { isAdmin, verifyauthToken } from '../middlewares/verifyauthToken.js';
import { imageUpload } from '../middlewares/profilemulter.js';


const router = express.Router();

// Create a new product:
router.post('/create', verifyauthToken, isAdmin, imageUpload.array("files", 5), createProduct);
// Get all product:
router.get('/allitem', verifyauthToken, getAllProduct);
// Get Top product:
router.get('/top', verifyauthToken, getTopProduct);
// Get ID of product:
router.get('/singleitem/:id', verifyauthToken, getSingleProduct);
// Update product:
router.put('/update/:id', verifyauthToken, isAdmin, UpdateProduct);
// Update product images:
router.put('/updateimages/:id', verifyauthToken, isAdmin, imageUpload.array("files", 5), UpdateImagesProduct);
// Delete product images:
router.delete('/deleteimages/:id', verifyauthToken, isAdmin, DeleteImagesProduct);
// Delete product:
router.delete('/delete/:id', verifyauthToken, isAdmin, DeleteProduct);
// Review product:
router.put('/review/:id', verifyauthToken, ReviewProduct);

export default router;