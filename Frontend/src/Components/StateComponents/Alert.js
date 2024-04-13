import { Modal } from './Modal'
import React from 'react'

const Alert = (props) => {
  const children = props.fn
  return (
	<Modal>
		{children}
	</Modal>
  )
}

export default Alert