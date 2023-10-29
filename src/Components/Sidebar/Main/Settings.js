import React from "react";
import setts from "../../../assets/icons/more.png";
function Settings() {
  return (
    <div className="side-item mt-3 d-flex">
      <img
        className="mx-3 mt-2"
        style={{ height: "20px" }}
        src={setts}
        alt="not found"
      />
      <p className="mt-2"> More </p>
    </div>
  );
}

export default Settings;
