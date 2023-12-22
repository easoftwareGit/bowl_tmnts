'use client'
import { useSelector, useDispatch } from "react-redux"
import { fetchTmnts } from "@/redux/features/tmnts/tmntsSlice"
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";

// import { baseOrigin, baseApi } from "@/lib/tools";

export default function TmntsPage() {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTmnts())
  }, [dispatch])

  const tmntsInState = useSelector((state:RootState) => state.tmnts)
  const tmnts = tmntsInState.tmnts;  

  return (
    <div>
      <h1>All Tournaments</h1>
      <p>Loaded tournaments</p>
    </div>
  )
}