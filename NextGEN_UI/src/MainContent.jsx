// src/MainContent.jsx
import React from 'react';
import PatientTable from './PatientTable';
import PatientDetails from './PatientDetails';
import Practitioner from './Practitioner';

const MainContent = ({ selectedContent, setSelectedPatient, selectedPatient }) => {
  if (selectedPatient) {
    return <PatientDetails data={selectedPatient} />;
  }

  switch (selectedContent) {
    case 'patient':
      return <PatientTable setSelectedPatient={setSelectedPatient} />;
    case 'practitioner':
      return <Practitioner />;
    default:
      return <div>Select a section from the sidebar</div>;
  }
};

export default MainContent;
