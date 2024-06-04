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
        const result = await Message.aggregate([
            {
              $match: {
                $or:[
                    {from: req.body.username},
                    {to: req.body.username}
                ] // Add your WHERE condition here
				,cleared_by:{$ne:req.body.username}
              },
            },
            {
              $group: {
                count: { $sum: 1 },
                _id: { 
					conn: '$connectionID',
					year: {$year: '$at'},
					month:{$month: '$at'},
					day: {$dayOfMonth: '$at' },
					hour: { $hour: "$at" },
					min: { $minute: "$at" },
					sec: { $second: "$at" }
				},
			  }
			},
			{
				$sort: {
					"_id.year":-1,
					"_id.month":-1,
					"_id.day":-1,
					"_id.hour":-1,
					"_id.min":-1,
					"_id.sec":-1
				}
			}
        ]);
        let conv =[]
		let used =[]
        for(let item of result)
		{
			let [a,b] = item._id.conn.split('&')
			let comp = a===req.body.username ? b :a
			if(!used.includes(comp))
			{
				let data = await Message.find({
					$or : [
						{ connectionID:a+'&'+b},
						{ connectionID:b+'&'+a}
					]
				}).select('-_id');
				let reads = data.filter( it=>it.read===false );
				item.read = Object.keys(reads).length ? false : true
				item.from = data[data.length-1].from
				item.at = data[data.length-1].at
				item.last = reads && Object.keys(reads).length>1 ?`${Object.keys(reads).length} new messages`:data[data.length-1].content;
				if(Object.keys(reads).length)
				{
					item.MessageOfSender = data[data.length-1].content
				}
				conv.push(item)
				used.push(comp)
			}
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