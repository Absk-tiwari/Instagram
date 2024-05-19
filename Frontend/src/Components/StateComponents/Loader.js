import React  from 'react'

const Loader = (props) => {
    const dimens = props.height??40 
	const Class = props.Class
    return (
        <div className={`spinner-container ${Class??''}`} >
            <div className='spinner' style={{height:dimens+'px', width:dimens+'px',marginLeft:props.left??0}}></div>
        </div>
    ) 
}

export default Loader