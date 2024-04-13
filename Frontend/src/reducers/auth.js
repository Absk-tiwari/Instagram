const { createSlice } = require("@reduxjs/toolkit")

const userToken = localStorage.getItem('token')
  ? localStorage.getItem('token')
  : null

const initialState = {
	loading:false,
	userInfo:{},
	userToken,
	error: null,
	success: false
}

const authSlice = createSlice({
	name:'auth',
	initialState,
	reducers:{
		logout:state=>{},
		setCredentials:(state, {payload})=>{
			state.userInfo = payload
		}
	},
	extraReducers:{
		getUser: (state) => {
			state.loading = true
			state.error = null
		}
	}
})

export const { logout, setCredentials } = authSlice.actions
export default authSlice.reducer