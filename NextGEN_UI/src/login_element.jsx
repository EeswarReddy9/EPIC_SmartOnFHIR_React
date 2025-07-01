import React from 'react';
import './App.css';
import MyImage from './image.png';

const Box = ({ onLoginClick }) => {
  return (
    <div className="page-container">
      <div className="box-container">
        <div className="box-content">
          <div className="center-content">
            <img src={MyImage} alt="My Box" className="box-image" />
            <button className="Login-btn" onClick={onLoginClick}>
              Login With NextGEN
            </button>
          </div>
        </div>
      </div>
      <footer className="footer">
        © 2025 Hexplora 4.0. All Rights Reserved
      </footer>
    </div>
  );
};

export default Box;
