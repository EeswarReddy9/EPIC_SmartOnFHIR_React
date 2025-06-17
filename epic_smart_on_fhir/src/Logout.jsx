import React, { useState } from 'react';
import './Logout.css';

const Logout = ({ onLogout }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // 1. Call logout API
      const response = await fetch('http://localhost:7002/api/logout', {
        method: 'POST',
        credentials: 'include' // Include cookies/session
      });

      // 2. Check for HTTP errors
      if (!response.ok) {
        throw new Error(`Logout failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // 3. Clear client state regardless of API result
      if (typeof onLogout === 'function') {
        onLogout();
      } else {
        console.error('onLogout is not a function');
      }
      
      // 4. Always redirect after handling
      window.location.href = 'http://localhost:5000';
      setIsLoggingOut(false);
    }
  };

  return (
    <button 
      className="logout-button" 
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <span>Logging out...</span>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1h8zm-2 9a.5.5 0 0 0 0-1H5.707l1.147-1.146a.5.5 0 1 0-.708-.708l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 11H10z"/>
          </svg>
          Logout
        </>
      )}
    </button>
  );
};

export default Logout;