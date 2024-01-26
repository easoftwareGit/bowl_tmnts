"use client";
import { useState, ChangeEvent, MouseEvent } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

type myObj = {
  id: number,
  name: string,
  myNum: number
}

export const TestForm = () => {

  const initArrOfObj: myObj[] = [
    {
      id: 1,
      name: "Obj 1",
      myNum: 0,
    },
  ];
  
  const [id, setId] = useState(2)
  const [numObjs, setNumObjs] = useState(1);
  const [myData, setMyData] = useState<Array<myObj>>(initArrOfObj);

  const handleAddObjClick = (e: MouseEvent<HTMLElement>) => {        

    console.log('id: ', id)

    const newObj = {
      id: id,
      name: "Obj " + id,
      myNum: 0,
    };    
    setId(id + 1)

    console.log('newObj: ', newObj)    

    setMyData([...myData, newObj]);
  };

  const handleObjInputChange =
    (id: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked } = e.target;
      const errName = name + "_err";
      setMyData(
        myData.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              name: value,
            };
          } else {
            return item;
          }
        })
      );
    };

  const handleDebug = (e: MouseEvent<HTMLElement>) => {
    console.log(myData)
    console.log('Done');
  };

  const onSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="form_container">
        <div className="row g-3 mb-3">
          <div className="col-sm-6">
            <label htmlFor="inputOther" className="form-label">
              Other Input
            </label>
            <input
              type="text"
              className="form-control"
              id="inputOther"
              name="other"
              maxLength={20}                            
            />
          </div>  
          <div className="col-sm-3">
            <label htmlFor="btnSubmit" className="form-label">
              &nbsp;
            </label>

            <button type="submit" id="btnSubmit" className="btn btn-primary">
              OK
            </button>
          </div>
        </div>  
        <div className="row g-3 mb-3">
          <Tabs defaultActiveKey="obj0" transition={false} id="objTabs">
            <Tab eventKey="obj0" title="Objects">
              <div className="row g-3 mb-3">
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
                      value={numObjs}
                    />
                    <button
                      className="btn btn-success border border-start-0 rounded-end"
                      type="button"
                      tabIndex={-1}
                      id="obj-plus"
                      onClick={handleAddObjClick}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-sm-3">
                  <button className="btn btn-danger" onClick={handleDebug}>
                    Debug
                  </button>
                </div>
              </div>
            </Tab>
            {myData.map((item) => (              
              <Tab key={item.id} eventKey={`obj${item.id}`} title={item.name}>
                <div className="row g-3 mb-3">
                  <div className="col-sm-3">
                    <label
                      htmlFor={`inputObjName${item.id}`}
                      className="form-label"
                    >
                      Obj Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`inputObjName${item.id}`}
                      name="name"
                      maxLength={20}
                      value={item.name}
                      onChange={handleObjInputChange(item.id)}
                    />
                  </div>
                  <div className="col-sm-3">
                    <label
                      htmlFor={`inputNum${item.id}`}
                      className="form-label"
                    >
                      My Num
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={10}
                      className="form-control"
                      id={`inputNum${item.id}`}
                      name="num"
                      value={item.myNum}
                      onChange={handleObjInputChange(item.id)}
                    />
                  </div>
                </div>
              </Tab>
            ))}
          </Tabs>
        </div>
      </div>
    </form>
  );
};
