import React from "react";
import explore from "../../../assets/icons/explore.png";
function Explore() {
  return (
    <div className="side-item mt-3 d-flex">
      <img
        className="mx-3 mt-3"
        style={{ height: "22px" }}
        src={explore}
        alt="not found"
      />
      <p className="mt-2"> Explore</p>
    </div>
  );
}

export default Explore;
