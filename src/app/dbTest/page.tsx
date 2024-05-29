"use client"
import React, { useState } from "react";
import { DbTestForm } from "./form";
import "./form.css";
import { DbUsers } from "./dbUsers";
import { DbAuth } from "./bdAuth";
import { DbBowls } from "./dbBowls";

export default function DbTest() {

  return (    
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="shadow p-3 m-3 rounded-3 container">
        <h2 className="mb-3">Tournament Info</h2>
        <DbTestForm />
      </div>
    </div>
  )  
}