"use client"
import React, { useState } from "react";
import "./form.css";
import { DbUsers } from "./dbUsers";
import { DbAuth } from "./bdAuth";
import { DbBowls } from "./dbBowls";

export default function DbTest() {

  return (    
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="shadow p-3 m-3 rounded-3 container">
        <h2> DbTest </h2>
        <DbUsers />
        <DbAuth />
        <DbBowls />
      </div>
    </div>
  )  
}