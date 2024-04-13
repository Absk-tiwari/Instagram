import React, { useEffect, useState } from 'react'

function Test() {
   const [photos, set] =  useState([])

   useEffect(()=>{
    fetch('https://instagram-api-one.vercel.app//api/profile/test').then(res=>{
        return res.json()
    }).then(data=>{
        set(data)
    })
    return ()=>{
        set([])
    }
   },[])
  return (
      <div>Test
        {photos.map( (photo,index)=>{
            return <img key={index} src={photo.content} alt='' />
        })}
    </div>
  )
}

export default Test