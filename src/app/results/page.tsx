"use client"
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchTmnts } from "@/redux/features/tmnts/tmntsSlice";
import { fetchTmntYears } from "@/redux/features/tmnts/yearsSlice";
import { YearObj, tmntListType } from "../../lib/types/types";
import TmntsList from "@/components/tmnts/tmntsList";
import { todayYearStr } from "@/lib/dateTools";

export default function TmntResultsPage() {
  const dispatch = useDispatch<AppDispatch>();

  const [tmntYear, setTmntYear] = useState(todayYearStr);  

  useEffect(() => {
    dispatch(fetchTmnts(tmntYear));
  }, [tmntYear, dispatch]);

  const stateTmnts = useSelector((state: RootState) => state.tmnts); 
  const tmntsArr: tmntListType[] = stateTmnts.tmnts;

  useEffect(() => {
    dispatch(fetchTmntYears());    
  }, [dispatch])
  
  const stateYears = useSelector((state: RootState) => state.tmntYears);
  const yearsArr: YearObj[] = stateYears.data;  

  function yearChanged(year: string): void {
    setTmntYear(year)
  }

  return (
    <div>
      <h1 className="d-flex justify-content-center">Tournament Results</h1>
      <TmntsList
        yearsArr={yearsArr}
        tmntsArr={tmntsArr}
        onYearChange={yearChanged}
      />
    </div>
  );
}
