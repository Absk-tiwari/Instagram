import React, { useEffect,useState, useRef } from 'react'
import { Link } from 'react-router-dom';
import cat1 from '../img/cat1.png'
import cat2 from '../img/cat2.png'
import cat3 from '../img/cat3.png'
import cat4 from '../img/cat4.png'

class SlideStories {
	constructor(id) {
		this.slide = document.querySelector(`[data-slide=${id}]`)
		this.active = 0
		this.init() 
	}

	activeSlide(index) {
		this.active = index
		this.items.forEach((item) => item.classList.remove('active'))
		this.items[index].classList.add('active')
		this.thumbItems.forEach((item) => item.classList.remove('active'))
		this.thumbItems[index].classList.add('active')
		this.thumbItems[index+1]?.classList.remove('prev-active')
		this.thumbItems[index-1]?.classList.add('prev-active')
		this.autoSlide()
	}

	next() {
		if (this.active < this.items.length - 1) {
			this.activeSlide(this.active + 1)
		} else {
			document.querySelector('.exit')?.click()
		}
	}

	prev() {
		if (this.active > 0) {
			this.activeSlide(this.active - 1)
		} else {
			document.querySelector('.exit')?.click()
		}
	}

	addNavigation() {
		const nextBtn = this.slide.querySelector('.slide-next')
		const prevBtn = this.slide.querySelector('.slide-prev')
		nextBtn.addEventListener('click', this.next)
		prevBtn.addEventListener('click', this.prev)
	}

	addThumbItems() {
		this.items.forEach(() => (this.thumb.innerHTML += `<span class="slide-thumb-item"></span>`))
		this.thumbItems = Array.from(this.thumb.children)
	}

	autoSlide() {
		clearTimeout(this.timeout)
		this.timeout = setTimeout(this.next, 5000)
	}

	init() {
		this.next = this.next.bind(this)
		this.prev = this.prev.bind(this)
		this.items = this.slide.querySelectorAll('.slide-items > *')
		this.thumb = this.slide.querySelector('.slide-thumbs')
		this.addThumbItems()
		this.activeSlide(0)
		this.addNavigation()
	}
}
const Story = () => {
	const isPhone = window.screen.width < 500
    const closer = useRef(null)
    const [pageX , setX] = useState(0)
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 100 

    const onTouchStart = e => { 
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        if(e.type==='click') {setX(e.pageX); return }
        setTouchStart(e.targetTouches[0].clientY)
    }

    const onTouchMove = e => setTouchEnd(e.targetTouches[0].clientY)

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const topSwipe = distance > minSwipeDistance
        const bottomSwipe = distance < -minSwipeDistance
        if(topSwipe) alert('story viewers')
        if(bottomSwipe)
        {
            closer.current.click()
        }
    }
	const slideStyle = {
		maxWidth:isPhone?'100%':'',
		maxHeight:isPhone?'100%':''
	}
    useEffect(()=>{
		new SlideStories('slide')
        return ()=> document.body.style.overscrollBehavior=''
    },[])

    return ( 
     <div id={'storyviewer'} 
	 	onClick={onTouchStart} 
		onTouchStart={onTouchStart} 
		onTouchMove={onTouchMove} 
		onTouchEnd={onTouchEnd}
	 >
		<div data-slide="slide" className="slide" style={slideStyle}>
			<div className="slide-items">
				<img src={cat1} alt="" className='slider-img'/>
				<img src={cat2} alt="" className='slider-img'/>
				<img src={cat3} alt="" className='slider-img'/>
				<img src={cat4} alt="" className='slider-img'/>
			</div>
			<nav className="slide-nav">
				<div className="slide-thumbs"></div>
				<button className="slide-prev">Previous</button>
				<button className="slide-next">Next</button>
			</nav>
		</div>
        <Link 
			className='fs-2 exit' 
			ref={closer} 
			style={{position:'absolute',top:'2%',left:'88%',zIndex:99}} 
			to={'/'}
		>
			<i className='btn btn-close' style={{ color:'white'}}/>
		</Link>
    </div>
	);
} 
     
export default Story