// src/PatientTable.jsx
import React, { useState, useEffect } from 'react';
import './PatientTable.css'; // optional if you want to isolate styles

const PatientTable = ({ setSelectedPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch list of patients from the backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:7002/api/patients', {
        method: "GET",
        credentials: "include"
      });
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  // Handle row click to fetch patient details
  const handlePatientClick = async (patientId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:7002/api/patient_data/${patientId}`, {
        method: "GET",
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched patient data for', patientId);
        console.log('Response from the Backend is', {data})
        setSelectedPatient(data);
      } else {
        console.error('Error fetching patient data');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-table-container">
      <table className="patient-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className="patient-row"
              onClick={() => handlePatientClick(patient.id)}
            >
              <td>{patient.name}</td>
              <td>{patient.gender}</td>
              <td>
                <button className="patient-action-button">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div className="loading-indicator">Loading patient details...</div>}
    </div>
  );
};

export default PatientTable;
