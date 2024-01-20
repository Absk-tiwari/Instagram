import React  from 'react'

const Loader = (props) => {
    const dimens = props.height 
    return (
        <div className='spinner-container'>
            <div className='spinner' style={{height:dimens+'px', width:dimens+'px',marginLeft:props.left??0}}></div>
        </div>
    ) 
}

export default Loader