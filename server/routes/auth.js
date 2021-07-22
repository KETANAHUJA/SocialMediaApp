const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model("User");
const jwt  = require('jsonwebtoken');

// this is destructuring 
// 2 dots means 2 directory up 
const {JWT_SECRET} = require('../keys');


const requireLogin = require('../middleware/requirelogin');
const requirelogin = require('../middleware/requirelogin');

// testing puprpose 

// router.get('/protected',requirelogin,(req,res)=>{
//     // user will get this Hello User only when user is logged In
//     // so will be creating middle ware to check is token correct 
//     res.send("Hello User"); 
// })

router.post('/signup',(req,res)=>{
    const {name,email,password,pic}=req.body;
    if(!email || !password || !name){
        return res.status(422).json({error:"please add all fields"});
    }
    // res.json({message:"succesfully posted"});
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exists with this email"});
        }
        // more big number , more secure  pass , default - 10
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                name,                
                password:hashedpassword,
                pic:pic
            })
            user.save() 
            .then(user=>{                
                return res.json({message:"saved Successfuly"});
            })
            .catch(err=>{
                console.log(err);
            })
        })
    
        
        
    })
    .catch(err=>{
        console.log(err);
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        res.status(422).json({error:"please add email and password both"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"invalid email or password"});
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"succesfully signed in"});
                // we need to send him a token 
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                // // res.json({token}) same below 
                const {_id,name,email,followers,following,pic} = savedUser;
                res.json({token:token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                // do not give hint to hacker than pass is wrong , he will get the email then 
                res.status(422).json({error:"invalid email or password"});
            }

        })
        .catch(error=>{
            console.log(error);
        })

    })
})

module.exports = router;