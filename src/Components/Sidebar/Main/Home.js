import React from "react";
import home from "../../../assets/icons/home.png";

function Home() {
  return (
    <div className="side-item mt-3 d-flex">
      <img
        className="mx-3 mt-2"
        style={{ height: "25px" }}
        src={home}
        alt="not found"
      />
      <p className="mt-2"> Home</p>
    </div>
  );
}

export default Home;
