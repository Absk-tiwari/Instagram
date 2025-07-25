import { configureStore } from "@reduxjs/toolkit";
import imageReducer  from "../reducers/reducer";
import authReducer from "../reducers/auth";
import postReducer from "../reducers/post";
import messageReducer from "../reducers/text";
import profileReducer from "../reducers/profileReducer";

export const store = configureStore({
	reducer:{ 
		auth:authReducer,
		image:imageReducer,
		posts:postReducer,
		messages:messageReducer,
		profile:profileReducer
	}
})