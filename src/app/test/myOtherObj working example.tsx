import React, { useState, ChangeEvent } from 'react';
import { myObj } from './myObjType';
import { Button } from 'react-bootstrap';

interface ChildProps {
  onObjectChange: (updatedObject: myObj) => void;
}

const initChild: myObj = {
  id: 1,
  name: 'Other 1',
  tabTitle: 'Other 1',
  myNum: 55,
  other: 567,
  errClass: '',
  name_err: '',
  myNum_err: ''
}

const MyOtherObj: React.FC<ChildProps> = ({ onObjectChange }) => {  

  const [childObject, setChildObject] = useState(initChild);

  const updateObject = () => {
    const updatedObj: myObj = {
      ...childObject,
      name: 'I have been updated'
    }
    setChildObject(updatedObj)
    // Notify the parent component about the updated object
    onObjectChange(updatedObj);
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => { 
    const { name, value } = e.target;
    setChildObject({
      ...childObject,
      [name]: value,
    })
  }

  return (
    <>
      <div className="row g-3 mb-3">
        <div className="col-sm-3 d-flex align-items-end">
          <Button
            className='primary'
            onClick={updateObject}
          >
            Click Me
          </Button>
          {/* <button
            className="btn btn-primary"
            // onClick={() => onDeleteObj(obj.id)}
          >
           Click Me
          </button> */}
        </div>
        <div className="col-sm-3">
          <label htmlFor="inputOtherName1" className="form-label">
            Object Name
          </label>
          <input
            type="text"          
            className="form-control"
            id="inputOtherName1"
            name="name"
            value={childObject.name}
            maxLength={20}
            onChange={handleInputChange}
            // onBlur={(e) => onBlur(e)}
          />
        </div>
        <div className="col-sm-3">
          <label htmlFor="inputOtherNum1" className="form-label">
            My Num
          </label>
          <input
            type="Number"          
            className="form-control"
            id="inputOtherNum1"
            name="myNum"
            value={childObject.myNum}          
            onChange={handleInputChange}
            // onBlur={(e) => onBlur(e)}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <h4>Child Component</h4>
        <p>Child Object: {JSON.stringify(childObject)}</p>
      </div>
    </>
  )
}

export default MyOtherObj;