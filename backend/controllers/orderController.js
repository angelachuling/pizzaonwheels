import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

//Create new order
//POST /api/orders
//private route
const addOrderItems = asyncHandler( async (req, res) => {
    const {
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice, 
        shippingPrice, 
        vatPrice, 
        totalPrice} = req.body;
    
    if(orderItems && orderItems.length === 0){
        res.status(400)
        throw new Error('No order items')
        return
    } else{
        const order = new Order({
        orderItems,
        user: req.user._id, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice, 
        shippingPrice, 
        vatPrice, 
        totalPrice
        })

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
});

//Get order by ID
//GET /api/orders/:id
//private route
const getOrderById = asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order){
        res.json(order)
    } else{
        res.status(404)
        throw new Error('Order not found')
    }
});

//Update order to paid
//PUT /api/orders/:id/pay
//private route
const updateOrderToPaid = asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order){
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }

        console.log('update order to paid', order)

        const updatedOrder = await order.save();
        res.json(updatedOrder)
        
    } else{
        res.status(404)
        throw new Error('Order not found')
    }
});



export {addOrderItems, getOrderById, updateOrderToPaid};
