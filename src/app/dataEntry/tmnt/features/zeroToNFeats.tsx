import React, { useState, ChangeEvent } from "react";
import { featsWChecked } from "@/lib/types/featTypes";
import { useSelector } from "react-redux";
import { selectAllFeats } from "@/redux/features/feats/featsSlice";
import { divFeatErrType, divFeatType, featsParamsType, seDivFeatType, squadType } from "../types";
import { Tabs, Tab } from "react-bootstrap";
import ModalConfirm, { initModalObj, delConfTitle } from "@/components/modal/confirmModal";
import SingleEntry from "./singleEntry";
import Eliminator from "./eliminator";
import Brackets from "./brackets";
import ValidateSingleEntry from "./validateSe";
import { FEATURES, singleEntryNames } from "@/lib/features";
import ValidateBrackets from "./validateBr";
import ValidateEliminator from "./validateEl";

interface ChildProps {  
  featsParams: featsParamsType
}

const defaultTabKey = ''; // used in Tabs, not keyPress

export const validateFeats = (
  featsParams: featsParamsType,
  squads: squadType[],
): boolean => {
  const { divFeats, setDivFeats } = featsParams;

  let areSeFeatsValid = true;
  let areBrktFeatsValid = true
  let areElimFeatsValid = true;
  const divErrs: divFeatErrType[] = []

  areSeFeatsValid = ValidateSingleEntry(featsParams, divErrs);
  areBrktFeatsValid = ValidateBrackets(featsParams, squads, divErrs);
  areElimFeatsValid = ValidateEliminator(featsParams, squads, divErrs);

  setDivFeats(
    divFeats.map(divFeat => {
      const dfErr = divErrs.find(de => de.sort_order === divFeat.sort_order)
      if (dfErr) {
        return {
          ...divFeat,
          errClassName: dfErr.errClassName,
        } 
      } else {
        return divFeat
      }
    })
  )

  return (areSeFeatsValid && areElimFeatsValid && areBrktFeatsValid)
}

const ZeroToNFeats: React.FC<ChildProps> = ({
  featsParams
}) => {

  const { divFeats, setDivFeats, seDivFeats, setSeDivFeats, elim, setElim, brkt, setBrkt, featAcdnErr, setFeatAcdnErr } = featsParams;
  const [modalObj, setModalObj] = useState(initModalObj);  
  const [listOfFeats, setListOfFeats] = useState(useSelector(selectAllFeats));  
  
  const addDivFeat = (feat: featsWChecked) => {

    const compareDivFeats = (df1: divFeatType, df2: divFeatType): number => {
      return df1.sort_order - df2.sort_order;
    }
    
    const added: divFeatType[] = [{
      id: '',
      div_id: '',
      feat_id: feat.id,
      feat_name: feat.feat_name,
      sort_order: feat.sort_order,
      entry_type: feat.entry_type,      
      errClassName: ''
    }]

    const temp = divFeats.concat(added)
    setDivFeats(temp.sort(compareDivFeats));
  }

  const addSeDivFeat = (feat: featsWChecked) => {

    const compareSeDivFeats = (sdf1: seDivFeatType, sdf2: seDivFeatType): number => {
      return sdf1.sort_order - sdf2.sort_order;
    }
    
    const added: seDivFeatType[] = [{
      id: '',
      div_feat_id: '',
      feat_name: feat.feat_name,
      sort_order: feat.sort_order,
      fee: '',
      fee_err: '',
    }];
    const temp = seDivFeats.concat(added)
    setSeDivFeats(temp.sort(compareSeDivFeats));
  }

  const handleFeatCheckChange = (id: string) => (e: ChangeEvent<HTMLInputElement>) => { 
    const { checked } = e.target;    
    setListOfFeats(
      listOfFeats.map((feat) => {
        if (feat.id === id) {
          if (checked) {
            addDivFeat(feat)
            if (singleEntryNames.includes(feat.feat_name)) { 
              addSeDivFeat(feat)
            } else if (feat.feat_name === FEATURES.ELIMINATOR) {
              // 
            } else if (feat.feat_name === FEATURES.BRACKETS) { 
              // 
            }          
          } else { 
            setDivFeats(divFeats.filter(divFeat => divFeat.sort_order !== feat.sort_order))            
            if (singleEntryNames.includes(feat.feat_name)) { 
              setSeDivFeats(seDivFeats.filter(seDivFeat => seDivFeat.sort_order !== feat.sort_order))              
            } else if (feat.feat_name === FEATURES.ELIMINATOR) {
              // 
            } else if (feat.feat_name === FEATURES.BRACKETS) { 
              // 
            } 
          }
          return {
            ...feat,
            checked,
          }
        } else {
          return feat;
        }
      })       
    )    
  }
  
  return (
    <>
      <div className="container">
        <div className="row g-3">
          <div className="col-sm-3">
            {listOfFeats.map((feat) => (
              <div key={feat.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={feat.checked}
                  id={`check${feat.id}`}                  
                  onChange={handleFeatCheckChange(feat.id)}
                />
                <label className="form-check-label" htmlFor={`check${feat.id}`}>
                  &nbsp;{feat.feat_name}
                </label>
              </div>
            ))}
          </div>
          <div className="col-sm-9">
            <Tabs
              defaultActiveKey={defaultTabKey}
              id="feature_tabs"
              className="mb-2 divFeatTabHeader d-flex flex-nowrap flex-row"
              variant="pills"
              style={{overflow:'auto'}}
              // onSelect={handleTabSelect}
              // activeKey={tabKey}
            >
              {divFeats.map((divFeat) => (
                <Tab
                  key={divFeat.sort_order.toString()}
                  eventKey={`divFeat${divFeat.sort_order}`}
                  title={divFeat.feat_name}
                  tabClassName={`${divFeat.errClassName}`}
                >
                  {(singleEntryNames.includes(divFeat.feat_name))
                    ? (
                      <SingleEntry 
                        divFeat={divFeat}
                        // seDivFeats={seDivFeats}
                        // setSeDivFeats={setSeDivFeats}
                        featsParams={featsParams}
                      />
                    )
                    : (
                      (divFeat.feat_name === FEATURES.ELIMINATOR) ? (
                        <Eliminator
                          elim={elim}
                          setElim={setElim}
                        />
                      ) : (
                          <Brackets
                            featsParams={featsParams}
                            // brkt={brkt}
                            // setBrkt={setBrkt}
                          />
                      )
                    )}
                </Tab>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ZeroToNFeats;