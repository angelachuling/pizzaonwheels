import express from 'express';
const router =express.Router();
import {protect, admin} from '../middleware/authMiddleware.js';
import {getProducts, getProductById, deleteProduct, createProduct, updateProduct} from '../controllers/productController.js';

//fetch all products, no access controll
router
.route('/')
.get(getProducts)
.post(protect, admin, createProduct)


//fetch single product, no access controll
router
.route('/:id')
.get(getProductById)
.delete(protect, admin, deleteProduct)
.put(protect, admin,updateProduct)


export default router;
