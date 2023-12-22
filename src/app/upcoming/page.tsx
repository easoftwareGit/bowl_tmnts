"use client";
import { useSelector, useDispatch } from "react-redux";
import { fetchTmntUpcoming } from "@/redux/features/tmnts/upcomingSlice";

import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { FullTmnt, TmntsFromStateObj } from "../types/tmntType";
import TmntsList from "../api/tmnts/tmntsList";

export default function TmntUpcomingPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTmntUpcoming());
  }, [dispatch]);

  const results = useSelector((state: RootState) => state.tmntUpcomping);
  const tmntUpcoming = results.data as unknown as TmntsFromStateObj;

  let tmntsArr: FullTmnt[] = [];
  if (Array.isArray(tmntUpcoming.tmntData)) {
    tmntsArr = tmntUpcoming.tmntData;
  }

  return (
    <div>
      <h1 className="d-flex justify-content-center">Upcoming Tournaments</h1>
      <TmntsList
        loading={results.loading}
        error={results.error}
        tmntsArr={tmntsArr}        
      />
    </div>
  );
}
