import React from "react";
import messages from "../../../assets/icons/messages.png";

function Messages() {
  return (
    <div className="side-item mt-3 d-flex">
      <img
        className="mx-3 mt-3"
        style={{ height: "20px" }}
        src={messages}
        alt="not found"
      />
      <p className="mt-2"> Messages </p>
    </div>
  );
}

export default Messages;
