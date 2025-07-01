import React, { useState } from 'react';
import './QualityMeasures.css';
import EditMeasureModal from './EditMeasureModal';

const QualityMeasures = ({ measures, memberId, onUpdateMeasure }) => {
  const [expandedMeasures, setExpandedMeasures] = useState([]);
  const [editingMeasure, setEditingMeasure] = useState(null);

  const enhancedMeasures = measures.filter(
    (measure) => !measure.measure_name.toLowerCase().includes('awv')
  );

  console.log('enhancedMeasures is : ', enhancedMeasures)

  const toggleMeasure = (index) => {
    setExpandedMeasures((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleEditClick = (measure) => {
    setEditingMeasure(measure);
  };

  const handleSaveMeasure = async (updatedMeasure) => {
    try {
      const response = await fetch('http://localhost:7002/api/update-measure', {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMeasure)
      });

      const result = await response.json();

      if (result.success && result.updated_measure) {
        onUpdateMeasure(result.updated_measure);
      } else {
        alert("Failed to update measure.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
    setEditingMeasure(null);
  };

  return (
    <div className="section quality-measures">
      <h3><i className="fas fa-clipboard-list section-icon"></i> Quality Measures</h3>

      {editingMeasure && (
        <EditMeasureModal 
          measure={editingMeasure}
          member_Id={memberId}
          onSave={handleSaveMeasure}
          onClose={() => setEditingMeasure(null)}
        />
      )}

      <div className="measures-table">
        <table>
          <thead>
            <tr>
              <th></th>
              <th><i className="fas fa-ruler-combined"></i> Measure</th>
              <th><i className="fas fa-info-circle"></i> Status</th>
              <th><i className="fas fa-tools"></i> Action</th>
            </tr>
          </thead>
          <tbody>
            {enhancedMeasures.map((measure, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>
                    {!measure.isAWV && (
                      <span 
                        className={`expand-icon ${expandedMeasures.includes(index) ? 'expanded' : ''}`}
                        onClick={() => toggleMeasure(index)}
                      >
                        ▶
                      </span>
                    )}
                  </td>
                  <td>{measure.measure_name}</td>
                  <td>
                    <span className={`status-tag ${measure.measure_value === 'No' ? 'status-complete' : 'status-gap'}`}>
                      {measure.measure_value === 'No' ? 'Complete' : 'Gap'}
                    </span>
                  </td>
                  <td>
                    {measure.isAWV ? (
                      <button className="edit-measure-btn">
                        <span className="calendar-icon">📅</span>
                        Schedule
                      </button>
                    ) : (
                      <button 
                        className="edit-measure-btn"
                        onClick={() => handleEditClick(measure)}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                        Edit
                      </button>
                    )}
                  </td>
                </tr>

                {!measure.isAWV && expandedMeasures.includes(index) && (
                  <tr className="details-row">
                    <td colSpan="4">
                      <div className="measure-details">
                        <p>Additional details for {measure.measure_name}</p>
                        <p>Status: {measure.measure_value}</p>
                        <p>Note: {measure.note || 'No notes available'}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QualityMeasures;
