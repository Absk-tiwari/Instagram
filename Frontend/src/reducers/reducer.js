const initialState = {
    imageURL:''
}
const imageReducer = (state=initialState,action)=>{
    switch(action.type){
        case 'SET_URL':
            return {
                ...state,
                imageURL:action.payload
            };
        default : return state
    }
}

export default imageReducer;  
 