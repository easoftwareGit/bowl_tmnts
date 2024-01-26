import React, { ChangeEvent, MouseEvent } from "react";
import { myObj } from "./myObjType";

interface ChildProps {
  obj: myObj;
  objCount: number;
  onAddObj: () => void;
  onDeleteObj: (id: number) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;  
}

const OneToNObj: React.FC<ChildProps> = ({
  obj,
  objCount,
  onAddObj,
  onDeleteObj,
  onInputChange,
}) => {
  
  const AddOrDelButton = () => {
    if (obj.id === 1) {
      return (
        <div className="col-sm-3">
          <label htmlFor="inputNumObjs" className="form-label">
            # Objects
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="inputNumObjs"
              name="num_objs"
              readOnly
              value={objCount}
            />
            <button
              className="btn btn-success border border-start-0 rounded-end"
              type="button"
              tabIndex={-1}
              id="event-plus"
              onClick={onAddObj}
            >
              +
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-sm-3 d-flex align-items-end">
          <button
            className="btn btn-danger"
            onClick={() => onDeleteObj(obj.id)}
          >
            Delete Object
          </button>
        </div>
      );
    }
  };

  // const InputName = () => {
  //   return (
  //     <div className="col-sm-3">
  //       <label htmlFor={`inputName${obj.id}`} className="form-label">
  //         Object Name
  //       </label>
  //       <input
  //         type="text"
  //         className="form-control"
  //         id={`inputName${obj.id}`}
  //         name="name"
  //         value={obj.name}
  //         maxLength={20}
  //         onChange={(e) => onInputChange(e.target.value)}
  //         // onChange={(e) => onInputChange(e)}
  //       />
  //     </div>
  //   );
  // };

  // const InputMyNum = () => {
  //   return (
  //     <div className="col-sm-3">
  //       <label htmlFor={`inputMyNum${obj.id}`} className="form-label">
  //         My Num
  //       </label>
  //       <input
  //         type="Number"
  //         className="form-control"
  //         id={`inputMyNum${obj.id}`}
  //         name="myNum"
  //         value={obj.myNum}
  //         readOnly
  //         // onChange={(e) => onInputChange(e)}
  //       />
  //     </div>
  //   );
  // };

  // AddOrDelButton, InputName and InputMyNum all have
  // <div className="col-sm-3">
  // ...
  // </div>

  return (
    <div className="row g-3 mb-3">
      <AddOrDelButton />
      <div className="col-sm-3">        
        <label htmlFor={`inputName${obj.id}`} className="form-label">
          Object Name
        </label>
        <input
          type="text"
          className="form-control"
          id={`inputName${obj.id}`}
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
