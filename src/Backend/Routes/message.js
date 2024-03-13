const  express = require("express");
const Message=require('../Models/Message');
const User=require('../Models/User');
const Post=require('../Models/Post');
const router = express.Router();
const fetchuser= require('../Middlewares/LoggedIn');

let error = { status : false, message:'Something went wrong!' }
let output = { status : true }

// yet to be tested
router.post('/', fetchuser, async(req, res) =>{
    try {
        //await Message.deleteMany() // truncate data
        let username = req.body.username
        const result = await Message.aggregate([
            {
              $match: {
                $or:[
                    {from: username},
                    {to: username}
                ] // Add your WHERE condition here
				,cleared_by:{$ne:username}
              },
            },
            {
              $group: {
                _id: '$connectionID',
                count: { $sum: 1 },
              },
            },
        ]);
        let conv =[]
        for(let item of result){
 
                let [a,b] = (item._id).split('&')
                let one = a+'&'+b
                let two = b+'&'+a
                let data = await Message.find({            
                  $or : [
                    { connectionID:one},
                    { connectionID:two}
                  ]
                }).select('content read from at -_id');
                let lastInd = data.length -1
                let lastMessage = data[lastInd].content
                let lastMessageFrom = data[lastInd].from
                let reads = data.filter(it=>{return it.read===false});
                item.last = reads && Object.keys(reads).length > 1 ?`${Object.keys(reads).length} new messages`:lastMessage
                item.read = Object.keys(reads).length ? false : true
                item.from = lastMessageFrom
                item.at = data[lastInd].at
                if(Object.keys(reads).length > 0){
                    item.MessageOfSender = lastMessage
                }
                conv.push(item)
        }
        return res.json(conv);
    } catch (e) {
        error.message = e.message
        return res.status(500).send(error)
    }
});
 
router.post('/of', fetchuser, async(req, res) =>{     // get the chats of
    try {
        // await Message.deleteMany()
        let cID = req.body.cID
        let [me,them] = cID.split('&')
        let one = me+'&'+them
        let two = them+'&'+me
        const result = await Message.find({
            $or : [
               { connectionID:one},
               { connectionID:two}
            ],deleted_by:{$ne:me}
        }).select('from content read');
          
        return res.json(result);

    } catch (e) {
        error.message = e.message
        return res.status(500).send(error)
    }
});
// has been tested and worked 

router.post('/create', fetchuser, async(req, res) =>{
    try {
        const user = await User.findById(req.body.id).select('-password')
        if(user){
            const post = await Post.create({
                user_id : user._id,
                username : user.username,
                name : user.name,
                content : req.body.postContent,
                caption : req.body.caption,
                location : req.body.location,
            })

            if(post){
                output.message ='Posted'
                return res.json(output);
            }
        }

        return res.json(error);
        
    } catch (e) {
        error.message = e.message 
        return res.json(error);
    }
});

router.post('/update', fetchuser, async(req, res) =>{   // mark texts as read 
    try {
        const me = req.body.me
        const username = req.body.username
        let one = me+'&'+username
        let two = username+'&'+me

        const filter = {
            $or: [
              { connectionID: one },
              { connectionID: two },
            ],
          };
          
        const update = {
            $set: {
                read:true, // Update the 'value' field to a new value
                // Add more fields to update as needed
            },
        };
          
        let updated = await Message.updateMany(filter,update)
        if(updated){
            output.message ='done'
            return res.json(output);
        }
        return res.json(error);
         
    } catch (e) {
        error.message = e.message 
        return res.json(error);
    }
});

router.post('/clear',fetchuser, async(req,res)=>{  // if both cleared it will be deleted
    const me = req.body.me
    const username = req.body.username
    let one = me+'&'+username
    let two = username+'&'+me

    const filter = {
        $or: [
            { connectionID: one },
            { connectionID: two },
        ],
    };
	let prevCleared = await Message.findOne(filter).select('cleared_by')
	let cleared
	if(prevCleared?.cleared_by){
		cleared = await Message.deleteMany(filter)
	}else{
		cleared = await Message.updateMany(filter,{cleared_by:me});
	}
    if(cleared){ 
        return res.json({...output,message:'cleared'})
    }
    return res.json(error)
})

router.post('/unsend', fetchuser, async(req, res) =>{
    const resp = await Message.deleteOne({_id:req.body._id})
    if(resp){
        return res.json(output)
    }
    return res.json(error)
})

router.post('/delete', fetchuser, async(req, res) =>{
    const updated = await Message.updateOne({_id:req.body._id}, { $set: {deleted_by:req.body.me} })
    if(updated){
        output.message='deleted for you'
        return res.json(output)
    }
    return res.json(error)
})

router.get('/count/:username', fetchuser, async(req, res) =>{  // route just for showing message-badge
	const {username} = req.params
	const result = await Message.aggregate([
		{
		  $match: {
			$or:[
				{from: username},
				{to: username}
			] // Add your WHERE condition here 
			,
			read:false,
			to:username
		  },
		},
		{
		  $group: {
			_id: '$connectionID',
			count: { $sum: 1 },
		  },
		},
	]);

    if(result){
        output.count= Object.keys(result).length 
        return res.json({...output, result})
    }
    return res.json(error)
})

module.exports=router  