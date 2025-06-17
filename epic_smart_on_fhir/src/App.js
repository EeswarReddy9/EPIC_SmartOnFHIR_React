// src/App.js
import React, { useState, useEffect } from 'react';
import Box from './login_element'; // Login component
import Layout from './Layout';     // Main layout

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('authenticated') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginClick = () => {
    window.location.href = 'http://localhost:7002/getAuthUrl';
  };

  return (
    <div>
      {isAuthenticated ? <Layout /> : <Box onLoginClick={handleLoginClick} />}
    </div>
  );
}

export default App;
