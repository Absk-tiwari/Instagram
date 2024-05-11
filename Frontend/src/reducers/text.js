const initialState = {
	metaData:{},
	data:[],
}
const messageReducer = (state=initialState,action)=>{
    switch(action.type){
        case 'SET_USERS': 
            return{
				...state,
				data:action.payload
			}
		case 'STOP_CALLS':
			return{
				...state,
				call:true
			} 
		case 'SET_META':
			return {
				...state,
				metaData:action.payload
			}
        default : return state
    }
}

export default messageReducer;  