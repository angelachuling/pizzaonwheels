import express from 'express';
const router =express.Router();
import {getProducts, getProductById} from '../controllers/productController.js';

//fetch all products, no access controll
router.route('/').get(getProducts);

//fetch single product, no access controll
router.route('/:id').get(getProductById)


export default router;
