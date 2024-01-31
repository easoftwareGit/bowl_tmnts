import React, { useState, ChangeEvent } from 'react';
import { myObj } from './myObjType';
import { Button } from 'react-bootstrap';

interface ChildProps {
  onObjectChange: (updatedObject: myObj[]) => void;
}

const initOtherObjs: myObj[] = [
  {
    id: 5,
    name: "Object 5",
    tabTitle: "Object 5",
    myNum: 55,
    other: 567,
    errClass: '',
    name_err: '',
    myNum_err: '',
  },
  {
    id: 6,
    name: "Object 6",
    tabTitle: "Object 6",
    myNum: 66,
    other: 678,
    errClass: '',
    name_err: '',
    myNum_err: '',
  },
  {
    id: 7,
    name: "Object 7",
    tabTitle: "Object 7",
    myNum: 77,
    other: 789,
    errClass: '',
    name_err: '',
    myNum_err: '',
  },
  {
    id: 8,
    name: "Object 8",
    tabTitle: "Object 8",
    myNum: 88,
    other: 890,
    errClass: '',
    name_err: '',
    myNum_err: '',
  },
];

const MyOtherObj: React.FC<ChildProps> = ({ onObjectChange }) => {  

  const [otherObjs, setOtherObjs] = useState(initOtherObjs);

  const updateObject = () => {
    setOtherObjs(
      otherObjs.map((otherObj) => {
        if (otherObj.id === otherObjs[0].id) {
          return {
            ...otherObj, 
            name: 'I have been updated'
          }
        } else {
          return otherObj
        }
      })
    )
    // Notify the parent component about the updated object
    onObjectChange(otherObjs);    
  }

  const handleInputChange = (id: number) => (e: ChangeEvent<HTMLInputElement>) => { 
    const { name, value } = e.target;
    setOtherObjs(
      otherObjs.map((otherObj) => {
        if (otherObj.id === id) {
          return {
            ...otherObj,
            [name]: value,
          }
        } else {
          return otherObj
        }
      })
    )
    // need to have seperate array to send to parent object
    // otherObjs not yet updated by setOtherObjs();
    const parentObjs = otherObjs.map(otherObj => {
      if (otherObj.id === id) {
        return {
          ...otherObj,
          [name]: value,
        }
      } else {
        return otherObj
      }      
    })    
    onObjectChange(parentObjs);  
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
            value={otherObjs[0].name}
            maxLength={20}
            onChange={handleInputChange(otherObjs[0].id)}
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
            value={otherObjs[0].myNum}          
            onChange={handleInputChange(otherObjs[0].id)}
            // onBlur={(e) => onBlur(e)}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <h4>Child Component</h4>
        <p>Child Object: {JSON.stringify(otherObjs[0])}</p>
      </div>
    </>
  )
}

export default MyOtherObj;