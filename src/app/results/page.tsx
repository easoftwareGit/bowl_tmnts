"use client";
import { useSelector, useDispatch } from "react-redux";
import { fetchTmntResults } from "@/redux/features/tmnts/resultsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { FullTmnt, TmntsFromStateObj } from "../types/tmntType";
import TmntsList from "../api/tmnts/tmntsList";

export default function TmntResultsPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTmntResults());
  }, [dispatch]);

  const results = useSelector((state: RootState) => state.tmntResults);
  const tmntResults = results.data as unknown as TmntsFromStateObj;

  let tmntsArr: FullTmnt[] = [];
  if (Array.isArray(tmntResults.tmntData)) {
    tmntsArr = tmntResults.tmntData;
  }

  return (
    <div>
      <h1 className="d-flex justify-content-center">Tournament Results</h1>
      <TmntsList
        loading={results.loading}
        error={results.error}
        tmntsArr={tmntsArr}        
      />
    </div>
  );
}
