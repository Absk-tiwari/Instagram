import { createSlice } from "@reduxjs/toolkit"
import {getUserDetails}  from "../actions/auth";

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
		},
		getUser: state => {
			state.loading = true
			state.error = null
			state.userInfo= getUserDetails()
		}
	}
})

export const { logout, setCredentials } = authSlice.actions
export default authSlice.reducer