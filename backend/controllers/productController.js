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

//Delete a product
//DELETE /api/products/:id
//private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(product) {
        await product.remove();
        res.json({message: 'Product removed'})
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

//Create a product
//POST /api/products
//private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        group: 'Veggie',
        category: 'pizza',
        countInstock: 0,
        numReviews: 0,
        description: 'Sample description'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

//Update a product
//PUT /api/products
//private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {name, price, description, image, group, category, countInstock} = req.body;

    const product = await Product.findById(req.params.id);

    if(product){
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.group = group;
        product.countInstock = countInstock;
        
        const updatedProduct = await product.save();
        res.status(201).json(updatedProduct);
    
    } else{
        res.status(404);
        throw new Error('Product not found')
    }
});

export {getProducts, getProductById, deleteProduct, createProduct, updateProduct};
