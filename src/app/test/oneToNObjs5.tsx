import React, { ChangeEvent, MouseEvent } from "react";
import { Button } from "react-bootstrap";
import { myObj } from "./myObjType";

interface ChildProps {
  obj: myObj;
  onDeleteObj: () => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;  
}

const OneToNObj: React.FC<ChildProps> = ({
  obj,
  onDeleteObj,
  onInputChange,
}) => {
  return (
    <div className="row g-3 mb-3">
      <div className="col-sm-3">
        <Button variant="danger" onClick={onDeleteObj}>
          Delete
        </Button>
      </div>
      <div className="col-sm-3">
        <label htmlFor={`inputMyNum${obj.id}`} className="form-label">
          Object Name
        </label>
        <input
          type="text"
          className="form-control"
          id={`inputMyNum${obj.id}`}
          name="name"
          value={obj.name}
          maxLength={20}
          onChange={(e) => onInputChange(e)}                    
        />
      </div>
      <div className="col-sm-3">
        <label htmlFor={`inputMyNum${obj.id}`} className="form-label">
          My Num
        </label>
        <input
          type="Number"
          className="form-control"
          id={`inputMyNum${obj.id}`}
          name="myNum"
          value={obj.myNum}
          onChange={(e) => onInputChange(e)}          
        />
      </div>
      <div className="col-sm-3"></div>
    </div>
  );
};

export default OneToNObj;
