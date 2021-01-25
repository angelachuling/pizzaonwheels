import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

//Auth user & get token
//POST /api/user/login
//public
const authUser = asyncHandler( async (req, res) => {
    const {email, password} = req.body;
    //console.log('req.body', req.body);

    const user = await User.findOne({email});
    //console.log(user);

    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
});

//Get user profile
//GET /api/users/profile
//private
const getUserProfile = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id);

    if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
});

//Register new user
//POST /api/users
//public
const registerUser = asyncHandler( async (req, res) => {
    const {name, email, password} = req.body;

    //console.log('req.body', req.body)

    //const userExists = await User.findOne({email});

    console.log('userExists', userExists)

    if(userExists){
        res.status(400)
        throw new Error('Email already exists')
    };

    const user = await User.create({
        name,
        email,
        password
    });

    //console.log('user', user)

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error('User not created')
    }
});



export {authUser, getUserProfile, registerUser};