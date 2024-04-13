import { Navigate } from "react-router-dom";

const authUser = () => {
	const token = localStorage.getItem('token');
	if(!token){
		return <Navigate to={'/login'} replace={true} />
	}
}
const protect = ({children}) => {
	const token = localStorage.getItem('token'); // use redux
	if(!token){
		return <Navigate to={'/login'} replace={true}/>
	}	
	return children
}
export {authUser,protect}