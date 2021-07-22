const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requirelogin = require('../middleware/requirelogin');
const Post = mongoose.model("Post");


// to show client all posts when requestes
router.get('/allposts',requirelogin,(req,res)=>{
    // all postes
    Post.find()
    // we want to get all details who posted so we are populating 
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    // try commenting above line , u will get it , we want id and name only 
    .then(posts=>{
        res.json({posts:posts})
    })
    .catch(error=>{
        console.log(error);
    })
})

// my following posts only 

router.get('/getsubposts',requirelogin,(req,res)=>{
    // all postes
    Post.find({postedBy:{$in:req.user.following}})
    // we want to get all details who posted so we are populating 
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    // try commenting above line , u will get it , we want id and name only 
    .then(posts=>{
        res.json({posts:posts})
    })
    .catch(error=>{
        console.log(error);
    })
})

router.post('/createpost',requirelogin,(req,res)=>{
    const {title,body,pic} = req.body;
    if(!title || !body || !pic){
        return res.status(422).json({error:"Please add all fields "});
    }
    // console.log(req.user);
    // res.send("Ok");
    // we dont want to store password of user who posted 
    // so doing 
    req.user.password=undefined;
    const post = new Post({
        title:title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(error=>{
        console.log(error);
    })
})



// in profile page of user, we only show posts created by user
router.get('/mypost',requirelogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost:mypost})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.put("/like",requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err) {
            return res.status(422).json({error:err})
        }
        else{
             res.json(result);
        }
    })
})
router.put("/unlike",requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err) {
            return res.status(422).json({error:err})
        }
        else{
             res.json(result);
        }
    })
})
router.put('/comment',requirelogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requirelogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})




module.exports  = router;