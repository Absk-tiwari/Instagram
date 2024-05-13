const initialState = {
	skip:0,
	call:false,
    totalPosts:[]
}
const postReducer = (state=initialState,action)=>{
    switch(action.type){
        case 'SET_POSTS': 
            return{
				...state,
				totalPosts:action.payload
			}
		case 'STOP_CALLS':
			return{
				...state,
				call:true
			}
		case 'SKIP_POSTS':
			return {
				...state,
				skip:action.payload
			}
	        case 'LOGOUT':
		    return {
			    ...state,
			    totalPosts:[],
			    call:false,
			    skip:0
		    }
        default : return state
    }
}

export default postReducer;  
