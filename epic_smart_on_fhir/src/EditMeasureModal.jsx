import React from 'react';

const EditMeasureModal = ({ measure, onSave, onClose, member_Id }) => {
  const [status, setStatus] = React.useState(measure.measure_value === 'No' ? 'Complete' : 'Gap');
  const [note, setNote] = React.useState(measure.note || '');

  const handleSubmit = () => {
    onSave({
      ...measure,
      measure_value: status === 'Complete' ? 'No' : 'Yes',
      note,
      member_Id
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Measure</h3>

        <div className="form-group">
          <label>Measure Name</label>
          <input type="text" value={measure.measure_name} readOnly />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="status-select"
          >
            <option value="Gap">Gap</option>
            <option value="Complete">Complete</option>
          </select>
        </div>

        <div className="form-group">
          <label>Note</label>
          <textarea 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            rows="3"
          />
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditMeasureModal;
