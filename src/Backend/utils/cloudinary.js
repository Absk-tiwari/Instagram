const cloudinary = require('cloudinary').v2;
const fs = require("fs")        

cloudinary.config({ 
  cloud_name: 'dgeom1ynq', 
  api_key:'791879938919463', 
  api_secret: 'IIy-i44kwsW94sTksC4bi7LK6K0'
});

const uploadOnCloudnary = async (localPath)=>{
    try{
        if(!localPath) return null
        const response = await cloudinary.uploader.upload(localPath,{
            resource_type:"auto"
        })
        //must be done
        return response

    }catch(error){
        fs.unlinkSync(localPath); // remove from temp
        return {status:false, message:error.message}
    }
}

module.exports = uploadOnCloudnary