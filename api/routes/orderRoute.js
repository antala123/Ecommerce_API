import express from 'express';
import { isAdmin, verifyauthToken } from '../middlewares/verifyauthToken.js';
import { Cancelorder, CreateOrder, Paymentorder, Statusorder, getAllOrder, getSingleOrder } from '../controllers/orderController.js';


const router = express.Router();

// Create order:
router.post('/create', verifyauthToken, CreateOrder);
// Get All order:
router.get('/all', verifyauthToken, isAdmin, getAllOrder);
// Get Single order:
router.get('/single/:id', verifyauthToken, isAdmin, getSingleOrder);
// Payment order:
router.post('/payment', verifyauthToken, Paymentorder);
// change status order:
router.put('/status/:id', verifyauthToken, isAdmin, Statusorder);
// Cancel order:
router.delete('/cancel/:id', verifyauthToken, Cancelorder);

export default router;