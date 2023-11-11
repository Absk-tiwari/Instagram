import React from 'react'

const Story = (props) => {
  return (
    <div className='story' style={{backgroundImage:`url(${props.img??''}`, backgroundRepeat:'round'}}/>
  )
}

export default Story