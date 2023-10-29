import React from "react";
import notifications from "../../../assets/icons/notifications.png";

function Notifications() {
  return (
    <div className="side-item mt-3 d-flex">
      <img
        className="mx-3 mt-2"
        style={{ height: "27px" }}
        src={notifications}
        alt="not found"
      />
      <p className="mt-2"> Notifications</p>
    </div>
  );
}

export default Notifications;
