import React from "react";
import search from "../../../assets/icons/search.png";

function Search() {
  return (
    <div className="side-item mt-3 d-flex">
      <img
        className="mx-3 mt-2"
        style={{ height: "22px" }}
        src={search}
        alt="not found"
      />
      <p className="mt-2"> Search </p>
    </div>
  );
}

export default Search;
