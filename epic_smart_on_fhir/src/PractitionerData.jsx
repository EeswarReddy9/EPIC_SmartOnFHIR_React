// src/PractitionerData.jsx
import React from 'react';

const PractitionerData = () => {
  const practitioners = [
    { id: 'erXuFYUfucBZaryVksYEcMg3', name: 'Camila Lopez', gender: 'Female' },
    { id: 'eq081-VQEgP8drUUqCWzHfw3', name: 'Derrick Lin', gender: 'Male' },
    { id: 'eIXesllypH3M9tAA5WdJftQ3', name: 'Linda Ross', gender: 'Female' },
    { id: 'e63wRTbPfr1p8UW81d8Seiw3', name: 'Mr. Theodore Mychart', gender: 'Male' },
  ];

  return (
    <div>
      <h1>Practitioner List</h1>
      <table className="practitioner-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {practitioners.map((practitioner) => (
            <tr key={practitioner.id}>
              <td>{practitioner.id}</td>
              <td>{practitioner.name}</td>
              <td>{practitioner.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PractitionerData;
