import React from "react";
import create from "../../../assets/icons/create.png";

function Create() {
  return (
    <div className="side-item mt-3 d-flex">
      <img
        className="mx-3 mt-2"
        style={{ height: "22px" }}
        src={create}
        alt="not found"
      />
      <p className="mt-2"> Create </p>
    </div>
  );
}

export default Create;
