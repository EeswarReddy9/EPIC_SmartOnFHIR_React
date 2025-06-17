import React, { useState } from 'react';
import MainContent from './MainContent';
import Logout from './Logout'; // Import the Logout component
import './Layout.css';
import MyImage from './image.png';


const Layout = ({ onLogout }) => {
  const [selectedContent, setSelectedContent] = useState('patient');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleSidebarClick = (content) => {
    setSelectedContent(content);
    setSelectedPatient(null);
  };

  return (
    <div className="layout-container">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <div 
          className={`sidebar-box ${selectedContent === 'patient' ? 'active' : ''}`}
          onClick={() => handleSidebarClick('patient')}
        >
          Patient
        </div>
        <div 
          className={`sidebar-box ${selectedContent === 'practitioner' ? 'active' : ''}`}
          onClick={() => handleSidebarClick('practitioner')}
        >
          Practitioner
        </div>
      </div>

      <div className="main-content">
        <div className="main-header">
          <img src={MyImage} alt="Application Logo" className="logo" />
          <Logout onLogout={onLogout} /> {/* Pass onLogout prop */}
        </div>

        <div className="main-body">
          <MainContent
            selectedContent={selectedContent}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
          />
        </div>

        <div className="main-footer">
          © 2025 Hexplora 4.0. All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default Layout;