const jwt  = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');
const mongoose = require('mongoose');
const User = mongoose.model("User");

module.exports = (req,res,next)=>{
    const {authorization}= req.headers;
    // authorization will look ---  Bearer token -> means
    // Bearer hnhgjnrf734u9b^&*tbd
    if(!authorization){
        // 401 means unauthorized 
        return res.status(401).json({error:"You must be logged In"});
    }
    // to acces only token
    const token = authorization.replace("Bearer ","");
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must be logged in"});
        }
        const {_id} = payload
        User.findById(_id)
        .then(userdata=>{
            req.user = userdata;
            // if this complete the next()
            next()
        })
        // so now we can move futher to data or next middleware 

        // not here as uppar vala pura ni hunda next call ho jnda 
        // next()
    }) 


}