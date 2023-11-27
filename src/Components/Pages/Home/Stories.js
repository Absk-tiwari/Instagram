import React from 'react'

const Stories = (props) => {
  return (
    <div className='story' style={{backgroundImage:`url(${props.img??''}`, backgroundRepeat:'round'}} > </div>
  )
}

export default Stories