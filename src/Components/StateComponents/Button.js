import React, { useState } from 'react'

const Button = ({text, alt=text, Class=false, Size=false}) => {
   const [show, setbg] = useState(false);
  return (
    <button onClick={()=>setbg(!show)} style={{fontWeight:'500'}} className={`btn btn-sm mx-1 my-2 border-0 ${Class??'text-dark'} ${Size?Size:''} `}>{!show ? text : alt}</button>  )
}

export default Button