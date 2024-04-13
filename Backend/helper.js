const User = require('./Models/User');

const notify = (data) => {
    console.log(data);
}
const updateLastActive = async username => {
	try { 
		let timeUpdated = await User.findOneAndUpdate({username},{ active: Date.now() })	  
		return timeUpdated?true:false
	} catch (err) {
		return err.message
	}
}
module.exports = {notify,updateLastActive}