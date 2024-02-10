const cloudinary = require('cloudinary');
const fs = require("fs")          

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudnary = async (localPath)=>{
    try{
        if(!localPath) return null
        const response = await cloudinary.uploader.upload(localPath,{
            resource_type:"auto"
        })
        //must be done
        console.log('file uploaded!', response.url)
        return response

    }catch(error){
        fs.unlinkSync(localPath); // remove from temp
        return {status:false, message:error.message}
    }
}

module.exports = uploadOnCloudnary