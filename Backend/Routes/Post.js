const express = require("express");
const Post = require("../Models/Post");
const User = require("../Models/User");
const router = express.Router();
const fetchuser = require("../Middlewares/LoggedIn");
const upload = require("../Middlewares/multer");
const Comment = require("../Models/Comments");
const Followers = require("../Models/Followers");
const fileSystem = require('fs')
const uploadOnCloudnary = require("./../utils/cloudinary");
const Notification = require("../Models/Notification");
const Saved = require("../Models/Saved");
const compressImages = require('compress-images')
let error = { status: false, message: "Something went wrong!" };
let output = { status: true };

// yet to be tested
router.post("/", fetchuser, async (req, res) => {
  try {
	let thisUser = await User.findOne({_id:req.body.id})
    let posts = await Post.find().sort({created_at:-1}).skip(req.body.skip).limit(2);
	let final=[] 
	for(let post of posts){ // customizing the follow btn state on post heads
		
		let pfp = await User.findById(post.user_id).select('profile -_id')
    	if(pfp===null) continue
		post._doc.profile = pfp.profile

		let found = await Followers.find({of:post.username,username:thisUser.username})
		if(found.length){ 
			final.push({...post._doc, shouldFollow:false , verified:pfp.verified }) 
		}else{
			final.push({...post._doc, shouldFollow:true , verified:pfp.verified }) 
		}
	}
    return res.json(final);
  } catch (e) {
    error.message = e.message;
    return res.status(500).send(error);
  }
});

// has been tested and worked

router.post("/create", [ upload.single('post'),fetchuser] , async (req, res) => {
  try {
    const user = await User.findById(req.body.id).select("-password")
    const post = req.file
    let filePath, compressedFilePath; 
    if(post && post.size > 0)
    {
      if(post.mimetype === 'image/png' || post.mimetype === 'image/jpeg')
        {
          compressedFilePath = "../Backend/tmp/uploads/compressed_" +post.originalname
          filePath = "../Backend/tmp/uploads/"+(new Date().getTime())+"-"+post.originalname
          const rate = 60
          fileSystem.readFile(post.path, function(err,data){
            if(err) throw err
            fileSystem.writeFile(filePath, data, async (err)=>{
              if(err) throw err
              compressImages(filePath,compressedFilePath,{
                compress_force:true ,statistic:true,autoupdate:true 
              }, false, 
              { jpg : {engine:"mozjpeg", command:[ "-quality", rate ]}},
              { png : {engine: "pngquant", command:[ "--quality=" + rate + "-"+ rate, "-o" ]}},
              { svg : {engine: "svgo", command:"--multipass=" }},
              { gif : {engine: "gifsicle", command:["--colors","64", "--use-col=web"] }},
              async (error, completed, statistic) => {
                console.log('Is compression failed ? ', error )
                console.log('Is compression completed ? ',completed)
                fileSystem.unlink(filePath, err => {
                  if(err) throw err
                })
              }
            )
            console.log('file has been compressed and save')
          })

          fileSystem.unlink(post.path, err=>{
            if(err) throw err;
          })
        })
      } else {
        console.log("Please select an image")
        error.message = "Please select an image";
      }
    }
    if (!post) return error;
    const uploadedPost = await uploadOnCloudnary(compressedFilePath)
     
    if (user) {
      let obj = {
        user_id: user._id,
        username: user.username,
        name: user.name,
        content: uploadedPost.url,
        caption: req.body.caption,
        location: req.body.location,
      }
      const post = await Post.create(obj)

      if (post) {
        output.message = "Posted";
        output.post = obj;
        return res.json(output);
      }
    }

    return res.json(error);
  } catch (e) {
    error.message = e.message;
    return res.json(error);
  }
});

router.post('/save',fetchuser, async(req,res)=>{
	try{
	let user = await User.findOne({_id:req.body.id})
	let saved = await Saved.create({username:user.username, post_id:req.body.post_id})
	if(saved){
		let updated= await Post.updateOne({_id:req.body.post_id},{$set:{saves:saved._id}})
		if(updated) return res.json(output) 
	}
	return res.json(error)
	}catch(error){
		return res.json({...error,message:error.message})
	}
})
router.delete("/delete/:id", async (req, res) => {
  try {
	const deleted = await Post.deleteOne({_id:req.params.id})
	if (deleted) {
		let comments = await Comment.deleteMany({for:req.params.id})
		let notifns = await Notification.deleteMany({about:{$regex: req.params.id }})
		if(comments && notifns){
			return res.json({...output,message:'deleted',post:deleted})
		}
	}
    return res.json(error)
  } catch (e) { 
    return res.json({...error, message:e.message})
  }
});

// yet to be tested
router.get("/getuserPosts", fetchuser, async (req, res) => {
  try {
    const posts = await Post.find({ user_id: req.body.id });
    return res.json(posts);
  } catch (e) {
    error.message = e.message;
    return res.status(500).json(error);
  }
});

router.post("/getPostsOf", fetchuser, async (req, res) => {
  try {
    const posts = await Post.find({ username: req.body.username }).sort({created_at:-1});
    return res.json(posts);
  } catch (e) {
    error.message = e.message;
    return res.status(500).json(error);
  }
});

router.get("/comments/:postid", fetchuser, async (req, res) => {
  let postID = req.params.postid;
  let comments = await Comment.find({ for: postID });
  return res.json(comments);
});

router.post("/update", fetchuser, async (req, res) => {  // when someone followed | un-followed
  try {
    let set = {};
    let thisUser = await User.findById(req.body.id).select(
      "username profile -_id"
    );
    if (req.body.type === "comment") {
      let comments = await Comment.find({ _id: req.body.postID });
      return res.json(comments);
    }
    if (req.body.type === "like") {
      set = { $push: { likes: thisUser.username } };
    }
    if (req.body.type === "unlike") {
      set = { $pull: { likes: thisUser.username } };
    }
    if (req.body.type === "follow") {
      let alreadyAfollower = await Followers.findOne({of: req.body.targetUsername,username: thisUser.username})
      if( alreadyAfollower?.of === undefined )
      {
	  await User.updateOne({ _id: req.body.id }, { $inc: { following: 1 } });
	  const updated = await User.updateOne(
	    { username: req.body.targetUsername },
	    { $inc: { followers: 1 } }
	  );
	  if (updated) {
	     await Followers.create({
	        of: req.body.targetUsername,
	        username: thisUser.username,
	     });
	     return res.status(200).json(output);
           }
	   return res.json(error);	      
      }
      return res.status(200).json(output);
    }
    if (req.body.type === "unfollow") {
      let isFollowing = await Followers.findOne({of: req.body.targetUsername,username: thisUser.username})
      if( isFollowing?.of !== undefined )
      {
	  await User.updateOne({ _id: req.body.id }, { $inc: { following: -1 } });
	  let deleted = await Followers.deleteOne({
	     of: req.body.targetUsername,
	     username: thisUser.username,
	  });
	  if (deleted) {
	     let updated = await User.updateOne(
	        { username: req.body.targetUsername },
	        { $inc: { followers: -1 } }
	     );
	  if (updated) return res.json(output);
	  }
	  return res.end(500).json(error);
      }
      return res.json(output);
    }

    let updated = await Post.updateOne({ _id: req.body.postID }, set);
    if (updated) {
      output.message = "Went straight.";
      return res.json(output);
    }
    return res.json(error);
  } catch (e) {
    error.message = e.message;
    return res.status(500).json(error);
  }
});

router.post("/addComment", fetchuser, async (req, res) => {
  try {
    let thisUser = await User.findById(req.body.id).select("username -_id");
	let upsert
	if(req.body.reply){
		let obj ={
			from: thisUser.username,
			for: req.body.postID,
			content: req.body.comment
		}
		upsert = await Comment.updateOne({for:req.body.postID},{$push:{replies:obj}})
	}else{
		upsert = await Comment.create({
		  from: thisUser.username,
		  for: req.body.postID,
		  content: req.body.comment,
		});
	}

    if (upsert) return res.json(output);
    return res.json({...error,message:'unable to add the comment'});

  } catch (e) {
    error.message = e.message;
    return res.status(500).json(error);
  }
});

router.delete("/comment/delete/:id", fetchuser, async (req, res) => {
  try {
    let _id = req.params.id;
    let removed = await Comment.deleteOne({ _id });
    if (removed) return res.json(output);
    error.message = "unable to delete the comment";
    return res.json(error);
  } catch (e) {
    error.message = e.message;
    return res.status(500).json(error);
  }
});

module.exports = router;
