// src/components/Diagnosis.jsx
import React, { useState } from 'react';
import './Diagnosis.css';

const Diagnosis = ({ 
  diagnosesData, 
  onSave,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [tempDiagnosis, setTempDiagnosis] = useState({});

  const handleEditClick = (index) => {
    setCurrentEdit(index);
    setTempDiagnosis({ ...diagnosesData[index] });
    setIsModalOpen(true);
  };

  const handleModalChange = (field, value) => {
    setTempDiagnosis(prev => ({ ...prev, [field]: value }));
  };

  const handleModalSave = () => {
    if (currentEdit !== null) {
      onSave(currentEdit, tempDiagnosis);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="section diagnoses">
      <h3><i className="fas fa-file-waveform section-icon"></i>Diagnoses</h3>
      <div className="diagnoses-table-container">
        <table className="quality-style-table">
          <thead>
            <tr>
              <th>Diagnosis Code</th>
              <th>HCC Code</th>
              <th>Description</th>
              <th>Current Year</th>
              <th>Previous Year</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {diagnosesData.map((diag, index) => (
              <tr key={`diag-${index}`}>
                <td>{diag.DgnsCD.trim()}</td>
                <td>{diag.HCCCODE.trim()}</td>
                <td>{diag.DiagnosisDescription}</td>
                <td>
                  <span className={diag.Diag_CY === 'YES' ? 'yes' : 'no'}>
                    {diag.Diag_CY === 'YES' ? 'Yes' : 'No' }
                  </span>
                </td>
                <td>
                  <span className={diag.Diag_PY === 'YES' ? 'yes' : 'no'}>
                    {diag.Diag_PY === 'YES' ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  <button 
                    className="edit-measure-btn"
                    onClick={() => handleEditClick(index)}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="diagnosis-modal">
            <h3>Edit Diagnosis</h3>
            
            <div className="modal-form-group">
              <label>Code:</label>
                <input
                value={tempDiagnosis.DgnsCD || ''}
                readOnly
                />
            </div>
            
            <div className="modal-form-group">
              <label>Description:</label>
              <input
                value={tempDiagnosis.DiagnosisDescription || ''}
                readOnly
              />
            </div>
            
            <div className="modal-form-group">
              <label>Current Year:</label>
              <select
                value={tempDiagnosis.Diag_CY || 'NO'}
                onChange={(e) => handleModalChange('Diag_CY', e.target.value)}
              >
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
            
            <div className="modal-form-group">
              <label>Previous Year:</label>
              <select
                value={tempDiagnosis.Diag_PY || 'NO'}
                onChange={(e) => handleModalChange('Diag_PY', e.target.value)}
              >
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
            
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleModalSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diagnosis;