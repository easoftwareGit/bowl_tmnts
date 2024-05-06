import { FC, useState, useEffect, ChangeEvent } from "react";
import { laneType, pairsOfLanesType } from "@/lib/types/types"
import { isOdd } from "@/lib/validation";

import "./lanesList.css";
import { btDbUuid } from "@/lib/uuid";

interface LanesListProps {
  squadId: string,
  lanes: laneType[],
}

export const getLanesFromPairs = (pairs: pairsOfLanesType[], squadId: string): laneType[] => {
  if (!pairs || pairs.length === 0) return [];
  const lanes: laneType[] = [];
  const inUsePairs = pairs.filter(pair => pair.in_use);
  inUsePairs.forEach(pair => {
    if (pair.in_use) {
      lanes.push(
        {
          id: pair.left_id,
          lane: pair.left_lane,
          squad_id: squadId
        },
        {
          id: pair.right_id,
          lane: pair.right_lane,
          squad_id: squadId
        }
      )
    }
  })
  return lanes
}

export const lanesThisSquad = (squadId: string, lanes: laneType[]): laneType[] => {
  if (!lanes || lanes.length === 0) return [];
  return lanes.filter(lane => lane.squad_id === squadId);
}

export const lanesNotThisSquad = (squadId: string, lanes: laneType[]): laneType[] => {
  if (!lanes || lanes.length === 0) return [];
  return lanes.filter(lane => lane.squad_id !== squadId);
}

export const pairsOfLanes = (squadId: string, lanes: laneType[]): pairsOfLanesType[] => {
  if (!lanes || lanes.length === 0 || isOdd(lanes.length)) return [];
  const pairs: pairsOfLanesType[] = [];
  const squadLanes = lanesThisSquad(squadId, lanes);
  for (let i = 0; i < squadLanes.length - 1; i += 2) {
    pairs.push(
      {
        left_id: squadLanes[i].id,
        left_lane: squadLanes[i].lane,
        right_id: squadLanes[i + 1].id,
        right_lane: squadLanes[i + 1].lane,
        in_use: true,
      }  
    )
  }
  return pairs;
}

const LanesList: FC<LanesListProps> = (props) => {
  const { squadId, lanes } = props;
  const initPairs = pairsOfLanes(squadId, lanes);

  const [pairs, setPairs] = useState(initPairs);

  useEffect(() => {
    setPairs(pairsOfLanes(squadId, lanes));
  },[squadId, lanes])

  const handleInputChnage = (id: string) => (e: ChangeEvent<HTMLInputElement>) => { 
    const { checked } = e.target;

    if (checked) { 
      pairs.pop();
      setPairs(
        pairs.map((pair) => {
          if (pair.left_id === id) {          
            return {
              ...pair,
              in_use: checked,
            }
          } else {
            return pair
          }
        })
      )
    } else {
      const newPairs = pairs.map((pair) => {
        if (pair.left_id === id) {          
          return {
            ...pair,
            in_use: checked,
          }
        } else {
          return pair
        }        
      })
      const lastPair = newPairs[newPairs.length - 1]; 
      const newPair: pairsOfLanesType = {
        left_id: btDbUuid("lan"),
        left_lane: lastPair.left_lane + 2,
        right_id: btDbUuid("lan"),
        right_lane: lastPair.right_lane + 2,
        in_use: true,
      }
      newPairs.push(newPair);
      setPairs(newPairs);
    }
  }

  return (
    <>
      {/* style width is in pixels */}
      <div
        className="d-flex justify-content-start lanes_table"
        style={{ width: 150 }}
      >
        <table className="table table-striped table-hover w-100">
          <thead>
            <th>
              Lanes
            </th>
            <th className="text-center">
              In Use
            </th>
          </thead>
          <tbody>
            {pairs.map((pair) => (
              <tr key={pair.left_id}>
                <td>{pair.left_lane} - {pair.right_lane}</td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    name="in_use"
                    id={`inUse${pair.left_id}`}
                    checked={pair.in_use}
                    onChange={handleInputChnage(pair.left_id)}
                  >
                  </input>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>  
    </>
  );
}

export default LanesList;