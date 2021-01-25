import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

//fetch all products, no access controll
const getProducts = asyncHandler( async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

//fetch single product, no access controll
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(product) {
        res.json(product)
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export {getProducts, getProductById};
