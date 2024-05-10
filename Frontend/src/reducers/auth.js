const userToken = localStorage.getItem('token')
  ? localStorage.getItem('token')
  : null

const initialState = {
	loading:false,
	userInfo:{},
	userToken,
	error: null,
	success: false,
	chatUser:{}
}

const authReducer = (state=initialState,action)=>{
	switch (action.type) {
		case 'SET_USER':
			return {
				...state,
				userInfo:action.payload
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
				chatUser:{}	
			}
		default:
			return state 
	}
}
// export const { logout, setCredentials, setCurrentUsers } = authSlice.actions
export default authReducer