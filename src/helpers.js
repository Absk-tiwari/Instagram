const randomStr = length => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';

	for (let i = 0; i < length; i++) {
	const randomIndex = Math.floor(Math.random() * characters.length);
	result += characters.charAt(randomIndex);
	} 
	return result;
}

const howLong = date => {

	let today = new Date()
	if(typeof date !== 'object'){
		date = new Date(date)
	}
	let diffTime = Math.abs(today - date); // returns the diff in milliseconds
	let seconds = diffTime / 1000 
	seconds = parseInt(seconds)
	// 1 hour = 3600
	// 1 day = 3600 * 24
	// 1 week = 3600 * 24 * 7
	let outputDiff
	if(seconds < 3600 && seconds > 60){
		let totalmins = seconds / 60
		outputDiff = Math.round(totalmins)+'m'
	}else if(seconds >= 3600 && seconds < 86400){
		let totalhrs = seconds / 3600 
		outputDiff = Math.round(totalhrs)+'h'
	}else if(seconds >= 3600 * 24 && seconds < 3600 * 24 * 7){
		let totaldays = seconds / 86400 
		outputDiff = Math.round(totaldays)+'d'
	}else if(seconds >= 3600 * 24 * 7 ){
		let totalweeks = seconds / 604800
		outputDiff = Math.round(totalweeks)+'w'
	}else if(seconds >= 365*24*60*60 ){
		let totalyrs = seconds / 604800
		outputDiff = Math.round(totalyrs)+'y'
	}else if(seconds < 60 && seconds > 10){
		outputDiff = Math.round(seconds)+'s'
	}else if(seconds < 10){
		outputDiff = ' just now'
	}
	// console.log(outputDiff)
	return outputDiff

}
export { randomStr, howLong }