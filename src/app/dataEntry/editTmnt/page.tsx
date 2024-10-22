"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react"; 
import Link from "next/link";

export default function UserTmntsPage() { 

  const { status, data } = useSession();
  const userId = data?.user?.id || ""; 

  // useEffect(() => {
  //   dispatch(fetchUserTmnts(userId));
  // }, [userId, dispatch]);

  // useEffect(() => {
  //   dispatch(fetchBowls());
  // }, [dispatch]);

  return (
    <>
      <div className="row g-3 mb-3 justify-content-md-center align-items-center">      
        <div className="col-md-auto">
          <Link className="btn btn-success" href="/dataEntry/tmnt">
            New Tournament
          </Link> 
        </div>    
        <div className="col-md-auto">
          User Id: {userId}
        </div>
      </div>
    </>
  );

}