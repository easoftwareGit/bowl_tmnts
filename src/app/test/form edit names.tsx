"use client"
import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ChildComponent from '../../../notUsed/testForm/childComponent';

interface ObjectType {
  id: number;
  name: string;
}

export const TestForm: React.FC = () => {
  const [data, setData] = useState<ObjectType[]>([
    { id: 1, name: 'Object 1' },
    { id: 2, name: 'Object 2' },
    { id: 3, name: 'Object 3' },
  ]);

  const handleInputChange = (id: number, updatedName: string) => {
    const updatedData = data.map(item =>
      item.id === id ? { ...item, name: updatedName } : item
    );
    setData(updatedData);
  };

  return (
    <div>
      <h2>Parent Component</h2>
      <Tabs defaultActiveKey="object1" id="objects-tabs">
        {data.map(item => (
          <Tab key={item.id} eventKey={`object${item.id}`} title={`Object ${item.id}`}>
            <ChildComponent data={item} onInputChange={(name: string) => handleInputChange(item.id, name)} />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

