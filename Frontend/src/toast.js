const hideMsg= () => {
	let opacity = 1;
	let interval =30; // Interval in milliseconds
	let element = document.getElementById('notifier')
	let fading = setInterval(function() {
		opacity -= 0.08;
		element.style.opacity = opacity;
		
		if (opacity <= 0) {
			clearInterval(fading);
			element.style.visibility = 'hidden'; 
		}
	}, interval);
} 	
const toast = txt => {
	let opacity = 0;
	let interval =30; // Interval in milliseconds
	let element = document.getElementById('notifier')
	element.children[0].innerHTML = txt
	element.style.visibility = 'visible'; 
	let showing = setInterval(function() {
		opacity += 0.08;
		element.style.opacity = opacity;
		if (opacity >= 1) {
			clearInterval(showing);
			setTimeout(()=>hideMsg(),3000)
		}
	}, interval);
} 
export { toast }