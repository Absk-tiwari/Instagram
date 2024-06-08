// Modal.js

import React from "react";

const Modal = props => {
  const { isOpen, dimens, onClose, children } = props
  const className = props.className??''
  if (!isOpen) return null;
  const { height, width } = dimens;

  return (
    <div
    id="modal" className={`customModal`}
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          width: width,
          margin: "auto",
          padding: "2%",
          border: "none",
          borderRadius: "12px",
          boxShadow: "10px solid gray"
        }}
        className={`firstChild `+className}
      >
		{ props.title ? 
			<div className="modal-header d-block" style={{borderBottom:'1px solid gray',marginBottom:'10px'}}>
				<h5 className="text-center fw-bolder">{props.title}</h5>
			</div>
			:
			null
		} 
		<div style={{overflowY:dimens.overflow??'auto',height}}>
        {children}
		</div>
      </div>
    </div>
  );
};

export default Modal;
