import { useState,useEffect } from "react";
import PropTypes from 'prop-types';
import './AWVSection.css';

const updateAWVDate = async (memberId, newDate) => {
  console.log('Received Member ID in updateAWVDate:', memberId);
  try {
    const response = await fetch('http://localhost:7002/api/update-awv-date', {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memberId: memberId,
        newAWVDate: newDate
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating AWV date:', error);
    throw error;
  }
};

const AWVDueDateSection = ({ dueDate, awvCode, onDateUpdate, memberId }) => {
  const [selectedDate, setSelectedDate] = useState(dueDate);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gapStatus, setGapStatus] = useState('Yes');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const calculateGapStatus = () => {
      try {
        const currentDate = new Date();
        const due = new Date(selectedDate);
        
        currentDate.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        const oneYearFromNow = new Date(currentDate);
        oneYearFromNow.setFullYear(currentDate.getFullYear() + 1);

        const isValidDate = !isNaN(due.getTime());
        const isNotPast = due >= currentDate;
        const isWithinOneYear = due <= oneYearFromNow;

        return isValidDate && isNotPast && isWithinOneYear ? "No" : "Yes";
      } catch (error) {
        return "Yes";
      }
    };

    setGapStatus(calculateGapStatus());
  }, [selectedDate]);

  useEffect(() => {
    setSelectedDate(dueDate);
  }, [dueDate]);

  const handleSubmit = async () => {
    if (!selectedDate) return;

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const result = await updateAWVDate(memberId, selectedDate);
      
      if (result.success) {
        if (typeof onDateUpdate === 'function') {
          onDateUpdate(selectedDate);
        }
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 2000);
      } else {
        setErrorMessage(result.message || 'Failed to update schedule');
      }
    } catch (error) {
      setErrorMessage('Failed to update schedule. Please try again.');
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

return (
    <div className="awv-card">
      <div className="card-header">
        <div className="icon-container">
          <i className="fas fa-calendar-check"></i>
        </div>
        <h3>Annual Wellness Visit</h3>
      </div>
      
      <div className="awv-content">
        <div className="awv-status">
          <div className="status-label">Visit Status</div>
          <div className={`status-value ${gapStatus === "Yes" ? 'gap' : 'no-gap'}`}>
            {gapStatus === "Yes" ? '❌ Gap Exists' : '✅ No Gap'}
          </div>
        </div>
        
        <div className="awv-details">
          <div className="detail-item">
            <span className="detail-label">Due Date:</span>
            <span className="detail-value">{dueDate}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">AWV Code:</span>
            <span className="detail-code">{awvCode}</span>
          </div>
        </div>
        
        <div className="date-selector">
          <label>Reschedule AWV</label>
          <div className="date-input-group">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
            <button 
                onClick={handleSubmit} 
                className="submit-btn"
                disabled={!selectedDate || isLoading}
                >
                {isLoading ? (
                    <span role="img" aria-label="calendar">📅</span>
                ) : (
                    <>
                    📅 Update
                    </>
                )}
                </button>

          </div>
          
          {selectedDate !== dueDate && (
            <div className="date-preview">
              New status: <span>{gapStatus === "Yes" ? 'Gap' : 'No Gap'}</span>
            </div>
          )}
        </div>
        
        {isSubmitted && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i> AWV schedule updated successfully
          </div>
        )}

        {errorMessage && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};


export default AWVDueDateSection;


AWVDueDateSection.propTypes = {
  dueDate: PropTypes.string.isRequired,
  awvCode: PropTypes.string.isRequired,
  onDateUpdate: PropTypes.func.isRequired,
  memberId: PropTypes.string.isRequired,
};