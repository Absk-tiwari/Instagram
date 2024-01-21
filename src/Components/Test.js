import React, { useEffect, useState } from 'react'

function Test() {
   const [photos, set] =  useState([])

   useEffect(()=>{
    console.log('rendered:')
    fetch('http://192.168.119.154:1901/api/profile/test').then(res=>{
        return res.json()
    }).then(data=>{
        set(data)
        console.log(data)
    })
    return ()=>{
        console.log('i m gone')
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