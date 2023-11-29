import React, { useState } from 'react'

const Button = ({text, alt=text, Class=false, Size=false}) => {
   const [show, setbg] = useState(false);
  return (
    <button onClick={()=>setbg(!show)} style={{fontWeight:'500'}} className={`btn btn-sm followbtn mx-1 my-3 border-0 ${Class?Class+' text-white':'text-dark'} ${Size?Size:''} `}>{!show ? text : alt}</button>  )
}

export default Button