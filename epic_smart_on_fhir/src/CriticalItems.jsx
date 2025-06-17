import React from 'react';
import PropTypes from 'prop-types';
import './CriticalItems.css';

function CriticalItems({ criticalItems }) {
  // Function to highlight specific phrases
  const highlightKeywords = (text) => {
    const keywords = [
      "Annual Wellness Visit",
      "RAF Score Gap:",
      "Remote Patient Monitoring"
    ];
    
    // Create a regex pattern to match any of the keywords
    const pattern = new RegExp(`(${keywords.join('|')})`, 'gi');
    
    // Split the text into parts
    const parts = text.split(pattern);
    
    return parts.map((part, index) => {
      // Check if part matches any keyword (case-insensitive)
      const isKeyword = keywords.some(keyword => 
        keyword.toLowerCase() === part.toLowerCase()
      );
      
      return isKeyword ? (
        <strong key={index}>{part}</strong>
      ) : (
        part
      );
    });
  };

  return (
    <div className='Critical-container'>
      <h2>Critical Action Items</h2>
      {criticalItems && criticalItems.length > 0 ? (
        <ul>
          {criticalItems.map((item, index) => (
            <li key={index}>
              {highlightKeywords(item)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No critical action items at this time.</p>
      )}
    </div>
  );
}

CriticalItems.propTypes = {
  criticalItems: PropTypes.arrayOf(PropTypes.string)
};

CriticalItems.defaultProps = {
  criticalItems: []
};

export default CriticalItems;