import React, { useState } from 'react';

interface ChildProps {
  onObjectChange: (updatedObject: any) => void;
}

const OtherObj: React.FC<ChildProps> = ({ onObjectChange }) => {
  // State to manage the object in the child component
  const [childObject, setChildObject] = useState<any>({ key: 'initialValue' });

  // Function to update the object and notify the parent
  const updateObject = () => {
    const updatedObject = { key: 'updatedValue' };
    setChildObject(updatedObject);
    // Notify the parent component about the updated object
    onObjectChange(updatedObject);
  };

  return (
    <div>
      <h2>Child Component</h2>
      <p>Child Object: {JSON.stringify(childObject)}</p>
      <button onClick={updateObject}>Update Object</button>
    </div>
  );
};

export default OtherObj;
