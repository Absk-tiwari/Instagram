import itachi from '../assets/icons/itachi.jpg';
import obito from '../assets/icons/obito.jpg';
import profile from '../assets/icons/profile.png';
import obio from '../assets/icons/pfp.png';
const userToken = localStorage.getItem('token')
  ? localStorage.getItem('token')
  : null
let me = localStorage.getItem('userLogin')
me = me? JSON.parse(me) : null
const initialState = {
	profileInfo:me,
	loading:false,
	userInfo:{}, // the other details of user ;
	userPosts:[], // for the post of user ; 
	userPostsLoaded:false,
	myInfo:{},
	myPosts:[],
	myPostsLoaded:false,
	userToken,
	error: null,
	success: false,
	chatUser:{},
	suggested:[],
	stories:[],
	searchedProfile:me?.username,
}

const authReducer = (state=initialState,action)=>{
	switch (action.type) {
		case 'SET_USER':
			return {
				...state,
				userInfo:action.payload
			} 
		case 'LOGIN':{
			return {
				...state,
				userToken:action.payload.token,
				profileInfo:action.payload.info
			}
		}
		case 'SET_MY_INFO':
			return {
				...state,
				myInfo:action.payload
			}
		case 'GET_USER':
			return state.userInfo
		case 'SET_CHAT_USER':
			return {
				...state,
				chatUser:action.payload
			}
		case 'REMOVE_CHAT':
			return {
				...state,
				chatUser:action.payload
			}
		case 'SET_SUGGESTED':
			return {
				...state,
				suggested:action.payload
			}
		case 'SEARCH_PROFILE':
			console.log(action)
			return {
				...state,
				searchedProfile:action.payload
			}
		case 'SET_PROFILE_POSTS':
			return {
				...state,
				userPosts:action.payload
			}
		case 'SET_MY_POSTS':
			return {
				...state,
				myPosts:action.payload
			}
		case 'GET_STORIES':
			return {
				...state,
				stories:[
					{ 
						cover:itachi,
						content : '',
						username:'itachi'
					},
					{
						cover:profile,
						content : '',
						username:'kiba'
					},
					{
						cover:obio,
						content : '',
						username:'obio'
					},
					{ 
						cover:obio,
						content : '',
						username:'obio'
					},
					{ 
						cover:obio,
						content : '',
						username:'obio'
					} 
				]
			}
		case 'MY_POSTS_LOADED':
			return {
				...state,
				myPostsLoaded:action.payload
		        }
		case 'SEARCH_USER_POSTS_LOADED':
			return {
			        ...state,
			        userPostsLoaded:action.payload
			}
		case 'LOGOUT':
		      return {
			      ...state,
			      userInfo:{},
			      myInfo:{},
			      userPostsLoaded:false,
			      myPostsLoaded:false,
			      userPosts:[],
			      myPosts:[],
			      userToken:null,
			      searchedProfile:null,
				  profileInfo:null
		      }
		case 'ERROR':
			return {
				...state,
				error:action.payload.error
			}
		case 'SET_LOADING':
			return {
				...state,
				loading:action.payload
			}
		default:return state 
	}
}
// export const { logout, setCredentials, setCurrentUsers } = authSlice.actions
export default authReducer
