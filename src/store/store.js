import { createStore , combineReducers } from "redux";
import imageReducer  from "../reducers/reducer";

const rootReducer = combineReducers({
    image:imageReducer
})
export const store = createStore(rootReducer)
