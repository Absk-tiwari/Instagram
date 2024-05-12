// Modal.js

import React from "react";

const Modal = ({ isOpen, dimens, onClose, children,className='' }) => {
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
          height: height,
          width: width,
          margin: "auto",
          padding: "2%",
          border: "none",
          borderRadius: "12px",
          boxShadow: "10px solid gray",
          overflow:dimens.overflow??'auto'
        }}
        className={`firstChild `+className}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
