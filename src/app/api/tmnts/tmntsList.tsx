"use client";
import { FullTmnt } from "@/app/types/tmntType";
import React, { FC, useState, useEffect } from "react";

interface TmntListProps {
  loading: boolean;
  error: string | undefined;
  tmntsArr: FullTmnt[];
}

interface StateOption {
  value: string;
  text: string;
}

function sortedIndex(arr: StateOption[], state: string): number {
  let low = 0;
  let high = arr.length;

  while (low < high) {
    // same as Math.floor((low + high) / 2);
    let mid = (low + high) >>> 1;
    if (arr[mid].text < state) low = mid + 1;
    else high = mid;
  }
  return low;
}

function getSortedStateOptions(tmntArr: FullTmnt[]): StateOption[] {
  if (!tmntArr) return [];
  const stateOptions: StateOption[] = [];
  tmntArr.forEach((tmnt) => {
    const state = tmnt.bowls.state;
    const index: number = sortedIndex(stateOptions, state);
    if (stateOptions.length > 0) {
      if (index === stateOptions.length) {
        stateOptions.push({ value: state, text: state });
      } else if (stateOptions[index].text !== state) {
        stateOptions.splice(index, 0, { value: state, text: state });
      }
    } else {
      stateOptions.push({ value: state, text: state });
    }
  });
  return stateOptions;
}

const TmntsList: FC<TmntListProps> = (props) => {
  const { loading, error, tmntsArr } = props;

  let stateFilter = "all";

  const [filteredTmnts, setFilteredTmnts] = useState(tmntsArr);

  useEffect(() => {
    setFilteredTmnts(tmntsArr.filter(filterTmnt));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmntsArr]);

  // populate array of states (no duplicates), keeping array sorted
  const sortedStates = getSortedStateOptions(tmntsArr);
  // add "all" at top
  sortedStates.splice(0, 0, { value: "all", text: "all" });

  function filterTmnt(tmnt: FullTmnt): boolean {
    if (stateFilter === "all") return true;
    return tmnt.bowls.state === stateFilter;
  }

  function handleStateFilterChange(e: any): void {
    const { name, value } = e.target;
    stateFilter = value;
    setFilteredTmnts(tmntsArr.filter(filterTmnt));
  }

  return (
    <>
      {loading && <div>Loading...</div>}
      {loading && error ? <div>Error: {error}</div> : null}
      {!loading && tmntsArr?.length ? (
        <div className="d-flex">
          <div className="flex-grow-1"></div>
          {/* style width is in pixels */}
          <div className="d-flex justify-content-center tmnt_table" style={{width: 720}}>
            <table className="table table-striped table-hover w-100">
              <thead>
                <tr>
                  {/* style width is in pixels */}
                  <th className="align-middle" style={{ width: 300 }}>
                    Tournament
                  </th>
                  <th className="align-middle" style={{ width: 300 }}>
                    Center
                  </th>
                  <th>
                    <select
                      id="stateFilter"
                      className="form-select w-auto"
                      aria-label="Select State"
                      onChange={handleStateFilterChange}
                    >
                      {sortedStates.map((stateOpt) => (
                        <option key={stateOpt.value} value={stateOpt.value}>
                          {stateOpt.text}
                        </option>
                      ))}
                    </select>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTmnts.map((tmnt) => (
                  <tr key={tmnt.id}>
                    <td>{tmnt.tmnt_name}</td>
                    <td>
                      <a
                        href={tmnt.bowls.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {tmnt.bowls.bowl_name}
                      </a>
                    </td>
                    <td>{tmnt.bowls.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex-grow-1"></div>
        </div>
      ) : null}
    </>
  );
};

export default TmntsList;
