import imageReducer  from "../reducers/reducer";
import {getUserDetails}  from "../actions/auth";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
	reducer:{
		auth:getUserDetails,
		image:imageReducer
	}
})