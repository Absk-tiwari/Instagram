import React, { useEffect , useState,useContext, useRef } from 'react'
import img from "../../../../assets/icons/profile.png" ;
import {socket} from '../../../../socket'
import ProfileContext from '../../../../Contexts/Profiles/ProfileContext';
import ContextMenu from '../../../StateComponents/ContextMenu';
import {compDates, howLong, randomStr} from '../../../../helpers'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {toast} from '../../../../toast'

function Chat(props) {
	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const dateToday = (new Date()).getDate()+(new Date()).getMonth()+(new Date()).getFullYear()
	const isChatOpened = useSelector(state=> state.auth.chatUser)
	const dispatch = useDispatch()
	
	const remC = () => dispatch({type:'REMOVE_CHAT',payload:{}})
	
	const {me,username,launch,update,till,changeMsg,details} = props    
	const [parent,setParent] = useState(false) // reflection to parent
	const {updateChat} = useContext(ProfileContext) // for target user api
	const [chats, loadChats] = useState([]) // old chats
	const [msg, setMessage] = useState('') // typing indicator
	const [hasmsg, AvailMessage] = useState(false) // decide to initiate the convo
	const [loader, load] = useState(true) // loader false will show fetched msgs 
	const [contextMenu, setContext] = useState({ isVisible: false, x: 0,y: 0,items: [],position:'absolute'})
	const box = useRef(null) // its child has all you need
	const file = useRef(null) // its child has all you need
	const [theme,setTheme] = useState('')
	const [chosen, choose] = useState('')
	const isPhone = window.screen.width < 500
	const unsend = (from, _id) => {   // handle un-sending message
	axios.post(`/messages/unsend`,{_id,of:from})
	.then(({data})=>{
		if(data.status) document.querySelector('[data-id="'+_id+'"]').remove() 
		update(!props.change)
	});
	}
	const backStyle = { position: 'absolute',left: '13px',fontSize: 'x-large'}
	const pfpStyle = {height:'63px',width:'63px'}

	const uploadFile = () => file.current?.click()

	const remove = (me, _id) => {   // handle delete message
		axios.post(`/messages/delete`,{me,_id,username})
		.then(({data})=>{
			if(data.status) document.querySelector('[data-id="'+_id+'"]').remove()
		})
	}
	const onContext = event => {  // add items to context-menu
	let items
	if(event.target.className==='other'){
		items=[
			{label:'Copy', onClick:()=>toast('tried to copy')},
			{label:'Delete', onClick:()=>remove(event.target.dataset.from, event.target.dataset.id)}
		]
	}else{
		items = [
			{	label:'Copy', onClick:()=>toast('tried to copy')},
			{	label:'Unsend', class:'text-danger', 
				onClick:()=>unsend(event.target.dataset.from, event.target.dataset.id)
			}
		]
	}
	event.preventDefault()
	const x = event.clientX - isPhone ? 200 :0
	const y = event.clientY 
	setContext({isVisible : true, x, y , items , c:100})
	}      // items are added to context menu

	const ThemeOptions = [
		{name: 'Morning', theme:'morning'},
		{name: 'Evening', theme:'evening'},
		{name: 'Dark', theme:'dark'},
		{name: 'Dust', theme:'dust'},
		{name: 'None', theme:''}
	]

	const OnKeyUp = event => {  // signal typing... 
	setMessage(event.target.value)
	socket.emit('typing', {is:me,to:username})
	}
 
 
	const scrollToBottom = time => {
	setTimeout(() => {
		if (box.current) box.current.scrollTop = box.current.scrollHeight;
	},time);
	};
  // eslint-disable-next-line
	const [isLoading, setLoading] = useState(false)

	const showMessage = (msg,id,other=true) => {    // let the message be printed
		let div = document.createElement('div')
		div.style.display='block'
		let p = document.createElement('p')
		p.innerText = msg
		p.dataset.id = id
		p.id = id
		p.className = other ? 'other': 'self'
		p.addEventListener('contextmenu', onContext)
		if(other){
			let hDiv = document.createElement('div')
			hDiv.classList.add('hstack')
			hDiv.classList.add('otherDiv')
			let imgElem = document.createElement('img')
			imgElem.src= details[0].profile?? img;
			imgElem.classList.add('img-rounded')
			imgElem.classList.add('inchat')
			hDiv.appendChild(imgElem) 
			hDiv.appendChild(p)
			div.appendChild(hDiv)
		}else div.appendChild(p) 

		if(box.current)
		{
			const last = box.current.children.length
			AvailMessage(true) // it had messages
			box.current.children[last-1].appendChild(div)
			scrollToBottom(0)
		}
	}    // messages has been printed

	const makeApreview = e => {
		let div = document.createElement('div')
		div.className='randomPreview justify-content-center align-items-center'
		let btn = document.createElement('span')
		btn.style.position='absolute'
		btn.className ='dismissPreview fa fa-close'  
		btn.addEventListener('click', ()=> document.querySelector('.randomPreview').remove())
		img = document.createElement('img')
		img.className='randomPreviewImg'
		img.style.position='absolute'
		img.src=e.target.src 
		div.appendChild(btn)
		div.appendChild(img)
		document.body.appendChild(div)
	}

	const sendImage = src =>{
		let img = document.createElement('img')
		img.src= src
		img.addEventListener('click',makeApreview)
		img.className=`selfImage`
		let createdID = randomStr(5) 
		img.dataset.id = createdID
		img.id = createdID
		let cstring = me+'&'+username
		let data = {from:me,to:username,content:src, cID:cstring,putAt:createdID,changeMsg:me,replaceMsg:msg}
		
		let added = till 
		added[username+'_last'] = 'Photo'
		added[username+'_seen'] = ' sent just now'
		let newMsg
		if(added[username]) // if it exists 
		{
			let prev = added[username]
			if(prev.includes('message')){
				let prev = added[username].split(' ')
				prev=prev[0]
				newMsg = `${parseInt(prev)+1} new messages`
			}else{
				newMsg = `2 new messages`
			}  
			data.replaceMsg =added[username]= newMsg 		
		}  
		changeMsg(added)
		socket.emit('send', data)
		if(box.current)
		{
			const last = box.current.children.length
			box.current.children[last-1].appendChild(img) // the way just sent message gets appended 
			scrollToBottom(0)
		}
	}

	const sendMessage = event => {
	event.preventDefault()
	let createdID = randomStr(5) // helper function
	if(msg){
		let cstring = me+'&'+username
		let data = {from:me,to:username,content:msg, cID:cstring,putAt:createdID,changeMsg:me,replaceMsg:msg}
		setMessage('')
		let added = till 
		added[username+'_last'] = msg
		added[username+'_seen'] = ' sent just now'
		let newMsg
		if(added[username]){
		let prev = added[username]
		if(prev.includes('message')){
			let prev = added[username].split(' ')
			prev=prev[0]
			newMsg = `${parseInt(prev)+1} new messages`
		}else{
			newMsg = `2 new messages`
		}  
		data.replaceMsg =added[username]= newMsg 		
		}  
		changeMsg(added)
		socket.emit('send', data)
	}
	showMessage(msg,createdID,false)
	setParent(!parent)
	if(update) update(parent)
	if(launch) updateChat(me,username) // seen text for you ? must be updated
	}

	useEffect(()=>
	{
		setLoading(true);
		document.addEventListener('click',()=>{ setContext({isVisible : false}) })
		socket.on('putID', data => document.querySelector(`[id="${data.on}"]`).dataset.id = data.exact )
		const receive = data=>{
			let content = data.content
			showMessage(content,data._id)
			let added = till
			added[username] = data.content
			added[username+'_seen'] = ' just now'
			changeMsg(added)
		}
		socket.on('receive', receive)  // handle upcoming text

		axios.post(`/messages/of`,{cID:me+'&'+username})
		.then( _ =>{
			let oldchats = _.data
			if(oldchats && oldchats.length){
			// console.log(oldchats);
			loadChats(oldchats)
			AvailMessage(true)
			}
			load(false) 
			scrollToBottom(1500)
			if(launch) updateChat(me,username) // was a text for u ? update it
			setLoading(false)
		})
		let ImgElem = file.current
		ImgElem.addEventListener('change', e =>{
			var fileReader = new FileReader()
			fileReader.onload = (e) => sendImage(e.target.result)
			fileReader.readAsDataURL(e.target.files[0])
		})
		setParent(!parent);
		window.addEventListener('popstate', ()=>dispatch({type:'REMOVE_CHAT'}))
		//  unmounting needs clarity
		return () => {
			ImgElem.removeEventListener('change',e=>{
				var fileReader = new FileReader()
				fileReader.onload = (e) => sendImage(e.target.result)
				fileReader.readAsDataURL(e.target.files[0])
			})
			document.removeEventListener('click', ()=> setContext({isVisible : false}))
			loadChats([])
			socket.off('receive',receive)
			window.removeEventListener('popstate', ()=> dispatch({type:'REMOVE_CHAT'}))
		}
	},[username,launch,me]
	)

	const checkTheme = () => setTheme(chosen)

	if(Object.keys(isChatOpened).length===0) return null;

	return (
		<>
		<ContextMenu {...contextMenu} />
		{(
		<>
		<div className={`container-fluid ${theme}`} style={{margin:0,padding:0,position:'',height:`100vh`}}>
			<section className='header' style={{backgroundColor:'#e9ecef'}}>
				<div className='hstack'>
					{isPhone ? 
					(<i className={'fa-solid fa-arrow-left'} 
						style={backStyle}
						onClick={remC}
					/>): null }
					<div className='col-9 hstack'>
						<div className='img-container mx-5 col-1'>
							<img 
								src={details && (details[0].profile??img)} 
								style={pfpStyle} 
								className='pfpicture' 
								alt={username} 
							/>
						</div>
						<div className='col-10' style={{paddingTop:'6px',lineHeight:0.5}}>
							{isPhone? <h5>{username}</h5>:  <h3>{username}</h3>}
							{details[0].active?
							<p> Active {details.onlines.includes(username)? 'now' 
							:`${howLong(details[0].active)} ago`}</p>
							: <p>{username}</p>
							}
						</div>
					</div>
					<div className='col-3 rel dropdown d-flex'>
						<span 
							className='bi-telephone iconStyle' 
							style={{marginTop:'-5px'}} 
							title='call'
							onClick={()=>toast('In development')} 
						/>
						{isPhone?'':
						<span 
							className='fa fa-video-camera iconStyle'
							title='video call'
							onClick={()=>toast('In development')}
						/>
						}
						<span 
							className='fa fa-ellipsis-v iconStyle dropdown' 
							data-bs-toggle={`dropdown`} 
							title='options'
						/> 
						<ul className={`dropdown-menu`}>
							<h5 className={'mx-4'} > Wallpaper </h5>
							{ThemeOptions.map((opt,key)=>{
								return <li key={key}>
									<span
										className={'dropdown-item px-4'}
										onMouseEnter={()=>setTheme(opt.theme)}
										onMouseLeave={checkTheme}
										onClick={()=>choose(opt.theme)}
									>
										{opt.name}
									</span>
								</li>
							})}
						</ul>
					</div>
				</div>
			</section>
			<section className={`body`} style={{height:'70vh'}} ref={box} >
				{ !hasmsg && !loader  ?
					(<div className='spinner-container'>
						<div style={{marginTop:'30vh', height:'100px'}}>
							<p> Send a message to start the conversation </p>
						</div>
					</div>)
					:null 
				}
				{ loader ? 
					(<div className='spinner-container d-block' style={{marginLeft:'45%',marginTop:'30%'}}>
						<div className='spinner' style={{height:'60px', width:'60px'}}/>
					</div>)
					:
					null
				}

				<div className='container' id='container'>
				{chats && chats.map((item, index)=>{ 
					return (
						<div key={index}>
						{  index===0?
							<div className={`text-center chat-time-stamp`}>
								{`${(new Date(item.at)).getDate()+' '+monthNames[(new Date(item.at)).getMonth()]+' '+((new Date(item.at)).getFullYear()===(new Date()).getFullYear()?'':(new Date(item.at)).getFullYear())}`
								}
							</div>
							:
							(compDates(item.at, chats[index-1].at)?
								<div className='text-center chat-time-stamp'>
									{dateToday === (new Date(item.at)).getDate()+(new Date(item.at)).getMonth()+(new Date(item.at)).getFullYear() ? 
									'Today' 
									: 
									`${(new Date(item.at)).getDate()+' '+monthNames[(new Date(item.at)).getMonth()]+' '+((new Date(item.at)).getFullYear()===(new Date()).getFullYear()?'':(new Date(item.at)).getFullYear())}`
									}
								</div>
							:null)
						}
						{item.from===me?
						(<div className={`d-block`}>
						{item.content.length>10000? // was an image from this side
							<img src={item.content} 
								className={`selfImage`} alt={``} 
								data-id={item._id} 
								onContextMenu={onContext} 
								onClick={makeApreview}
							/>:
							<p data-from={item.from===me?me:username} 
								className='self' 
								data-id={item._id} 
								onContextMenu={onContext} >
								{item.content}
							</p> // was a normal text
						} 
						
						{index===chats.length-1 && item.read ? 
							<small 
								style={{marginTop:'-18px'}} 
								className={'readStat'}
							>
								seen
							</small> 
							:null
						}
						</div>):
						(<div className='d-block'>
							<div className='hstack otherDiv'>
								<img 
									className={`img-rounded inchat`} 
									src={details ? (details[0].profile??img):null} 
									alt={''} 
								/>
								{ item.content?.length > 10000 ?
									<img 
										src={item.content} 
										className={`otherImage`} 
										data-id={item._id} 
										alt={``} 
										onContextMenu={onContext} 
										onClick={makeApreview} 
									/>
								:
								<p className='other' data-id={item._id} onContextMenu={onContext}>
									{item.content}
								</p>
								}
							</div>
						</div>)}
						</div>
					) 
				})}
				</div>

			</section>
			<section className={`footer ${isPhone?'':'mt-4'}`}>
				<form className='hstack rel' onSubmit={sendMessage} >
					<input 
						type='text' 
						className={isPhone?'chat-input-phone':'chat-input'} 
						name='message' 
						placeholder={`Message...`} 
						value={msg} 
						onChange={OnKeyUp} 
						autoComplete='off' 
						onBlur={()=>socket.emit('stopped',{is:me,to:username})} 
					/>
					<span style={{left:'3%',position:'absolute'}}>
						<i className="fa-regular fs-3 fa-face-smile"/>
					</span>
					<span style={{left:'88%',position:'absolute'}} onClick={uploadFile}>
						<i className={`fa-regular ${msg.length?'d-none':''} fs-3 fa-image`}/>
					</span>
					<input className='d-none' type='file' name='sendImage' ref={file}/>
					<span 
						onClick={sendMessage} 
						className={`text-primary abs ${msg.length?'':'d-none'} fs-5 fw-bold`} 
						style={{width:'90%', marginLeft:'15px', left:isPhone?'78%':'85%',fontFamily:'monospace'}} 
					> 
						Send 
					</span>
				</form>
			</section>
		</div>
		</>
		)
		}
	</>
	)
}

export default Chat
