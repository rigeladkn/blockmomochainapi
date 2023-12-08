const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const Balance = require('../models/Balance');
const momocontroller = require('./momo.controller');
const Helpers = require('../helpers/Helpers');


// @desc Register a new user on system (momo network)
// route POST /api/users
// @access PUBLIC
const register = asyncHandler(async (req,res) => {
    let {firstname,lastname,email,phone,password} = req.body;
    const userExists = await User.findOne({email:email,phone:phone});

       if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create(req.body);
   
    if(user){
        //---------------- GENERATE USER XREFID -------------
        user.collectionXrefId = await Helpers.generateUserXrefId();
        user.disbursementXrefId = await Helpers.generateUserXrefId();
        user.save();
        // -----------------------------------------------------
        // --------- MTN MOMO : GENERATE USER XREF ID AND CREATE USER API----------
            try {
                const r = await momocontroller.createApiUser(user,'COLLECTION');
                const collectionApiKey = await momocontroller.createApiKey(user,'COLLECTION');
                console.log(collectionApiKey);
                user.collectionApiKey = collectionApiKey;
                //-----------
                const rd = await momocontroller.createApiUser(user,'DISBURSEMENT');
                const disbursementApiKey = await momocontroller.createApiKey(user,'DISBURSEMENT');
                console.log(disbursementApiKey);
                user.disbursementApiKey = disbursementApiKey;
                //-----------
                user.save();
            } catch (error) {
                // await User.deleteOne({_id:user._id});
                // await Balance.deleteOne({_id:user._id});
                throw new Error(error);
            }
        // -------------------
        //Create user balance set to 0
        const balance = await Balance.create({
            userId : user._id,
        });
   
        if(balance){ //all things did well, return success

     
            res.status(201).json({
                'success' : true,
                'message' : 'User created successfully' 
            })
        }
        else{
            //otherwise delete user
            User.deleteOne({_id : user._id});
            res.status(500);
            throw new Error('Something went wrong');
        }
    }
    else{
        res.status(400);
        throw new Error();
    }
    
});

// @desc Get User profile
// route GET /api/users/profile
// @access PRIVATE
const profile = asyncHandler(async (req,res) => {
    res.status(200);
    res.json({
        success : true,
        user : req.user
    });
});

// @desc Login User 
// route POST /api/auth/login
// @access PUBLIC
const login = asyncHandler(async (req,res) => {
  const {email,password} = req.body;
  const user = await User.findOne({email : email});
  console.log(user);
  const check = await user.checkPassword(password);
  if(user){
    let token = await jwt.sign({userId : user._id},process.env.JWT_SECRET,{expiresIn: '1d'});
    //---------- 
    const collectionAccessToken = await momocontroller.getAccessToken(user,'COLLECTION');
    if(collectionAccessToken == null){
        res.status(400);
        throw new Error('Login uncessfull');
    }
    else{
        user.collectionAccessToken = collectionAccessToken;
    }
    //----------
    const disbursementAccessToken = await momocontroller.getAccessToken(user,'DISBURSEMENT');
    if(disbursementAccessToken == null){
        res.status(400);
        throw new Error('Login uncessfull');
    }
    else{
        user.disbursementAccessToken = disbursementAccessToken;
    }
    //----------
    user.save();
    res.status(201).json({
        success : true,
        message : 'User logged successfully',
        token : token,
        user : {
            phone : user.phone,
            id : user._id
        }
    });
  }
  else{
    res.status(401);
    throw new Error('Email or password incorrect');
  }
});

// @desc Logout User
// route POST /api/auth/logout
// @access PRIVATE
const logout = asyncHandler(async function(req,res){
    
});

// @desc Update current user infos
// route POST /api/users/profile/update
// @access PRIVATE
const updateUserProfile = asyncHandler(async function(req,res){
    try {
        const user = req.user;
        user.firstname = req.body.firstname || user.firstname; 
        user.lastname = req.body.lastname || user.lastname; 
        user.email = req.body.email || user.email; 
        if(req.body.password){
            user.password = req.body.password; 
        }
        user.save();
    } catch (error) {
        res.status(400);
        throw new Error('Something went wrong. Unable to update user');
    }
});

const getBalance = asyncHandler(async function(req,res){
    console.log(req.user);
    const balance = await req.user.getBalance();
    console.log(balance);
    return res.status(200).json({
        success : true,
        message : 'Successfully getting balance',
        balance : balance
    })
});

module.exports = {
    register,
    login,
    profile,
    logout,
    getBalance
} 