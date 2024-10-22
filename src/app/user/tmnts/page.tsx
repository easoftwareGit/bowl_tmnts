"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useSession } from "next-auth/react"; 
import Link from "next/link";
import { fetchUserTmnts, getUserTmntError, getUserTmntStatus } from "@/redux/features/userTmnts/userTmntsSlice";
import { tmntsListType } from "@/lib/types/types";
import { dateTo_UTC_MMddyyyy } from "@/lib/dateTools";

export default function UserTmntsPage() { 
  const dispatch = useDispatch<AppDispatch>();

  const { status, data } = useSession();
  const userId = data?.user?.id || ""; 

  useEffect(() => {
    dispatch(fetchUserTmnts(userId));
  }, [userId, dispatch]);

  const stateUserTmnts = useSelector((state: RootState) => state.userTmnts); 
  const userTmnts: tmntsListType[] = stateUserTmnts.userTmnts

  const userTmntsStatus = useSelector(getUserTmntStatus);  
  const userTmntsError = useSelector(getUserTmntError);

  return (
    <>
      {(userTmntsStatus === 'loading') && <div>Loading...</div>}      
      {userTmntsStatus !== 'loading' && userTmntsError
        ? (<div>Error: {userTmntsError}</div>
        ) : null}
      {(userTmntsStatus === 'succeeded') ? ( 
        <div className="container">
          <div className="row g-3 mb-3 justify-content-md-center align-items-center">      
            <div className="col-md-auto">
              <Link className="btn btn-success" href="/dataEntry/tmnt">
                &nbsp;&nbsp;New Tournament
              </Link> 
            </div>    
          </div>
          <div className="row g-3 mb-3 justify-content-md-center align-items-center">      
            <div className="flex-grow-1 bg-secondary-subtle"></div>
            {/* style width is in pixels */}
            <div
              className="d-flex justify-content-center tmnt_table bg-primary-subtle"
              style={{ width: 920 }}
            >
              <table className="table table-striped table-hover w-100">
                <thead>
                  <tr className="tmnts-header-row">
                    <th className="align-middle" style={{ width: 220 }}>
                      Tournament
                    </th>
                    <th className="align-middle" style={{ width: 100 }}>
                      Start Date
                    </th>
                    <th className="align-middle" style={{ width: 250 }}>
                      Center
                    </th>
                    <th className="align-middle" style={{ width: 120 }}>
                      Location
                    </th>
                    <th className="align-middle" style={{ width: 280, textAlign: "center" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userTmnts.map((tmnt) => (
                    <tr key={tmnt.id}>
                      <td className="align-middle">{tmnt.tmnt_name}</td>                      
                      <td className="align-middle">{dateTo_UTC_MMddyyyy(new Date(tmnt.start_date))}</td>
                      <td className="align-middle">{tmnt.bowls.bowl_name}</td>
                      <td className="align-middle">{tmnt.bowls.city}, {tmnt.bowls.state}</td>
                      <td className="align-middle" style={{textAlign: "center" }}>
                        <button type="button" className="btn btn-info">Edit</button>&nbsp;&nbsp;
                        <button type="button" className="btn btn-primary">Run</button>&nbsp;&nbsp;
                        <button type="button" className="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>    
      ) : null}
    </>
  );

}