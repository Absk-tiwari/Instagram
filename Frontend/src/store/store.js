import imageReducer  from "../reducers/reducer";
import authReducer from "../reducers/auth";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
	reducer:{ 
		auth:authReducer,
		image:imageReducer
	}
})