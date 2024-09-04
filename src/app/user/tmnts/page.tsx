"use client";

import React from "react";
import Link from "next/link";

export default function UserTmnts() {

  const handleNewTmnt = () => {
    console.log("handleNewTmnt")
  }

  return (
    <>
      <div className="row g-3 mb-3 justify-content-md-center align-items-center">      
        <div className="col-md-auto">
          {/* <h6> </h6> vertically aligns <h5> with <button>'s */}
          <h6> </h6>
          <h5>Tournaments:</h5>
        </div>    
        <div className="col-md-auto">
          <Link className="btn btn-success" href="/dataEntry/tmnt">
            New
          </Link> 
        </div>    
        <div className="col-md-auto">
          <button className="btn btn-info" onClick={handleNewTmnt}>
            Edit
          </button>
        </div>    
        <div className="col-md-auto">
          <button className="btn btn-primary" onClick={handleNewTmnt}>
            Run
          </button>
        </div>    
      </div>
    </>
  )
}