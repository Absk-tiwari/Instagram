import React, { useState } from 'react'

const Button = ({text, alt=text, Class=false, Size=false}) => {
   const [show, setbg] = useState(false)
   let classes = ['followingbtn', 'followbtn']
   let c = {
	text:Class,
	alt: classes.filter(c=>c!==Class)
   }
  return (
    <button onClick={()=>setbg(!show)} className={`btn btn-sm mx-1 my-2 ${!show ? c.text : c.alt} ${Size?Size:''} `}>{!show ? text : alt}</button>  )
}

export default Button