import PropTypes from 'prop-types'; 
import './Demographics.css';
import CriticalItems from './CriticalItems';

const Demographics = ({ memberData, criticalItems }) => {
  const safeData = memberData || {
    ID: 'N/A',
    Name: 'Not available',
    DOB: 'Unknown',
    Gender: 'Unspecified',
    CriticalItems:'Not available'
  };
  // const criticalItems = memberData.Critical_Items;

  return (
    <div className="demographics-container">
      <div className='demographics-content'>
        <div className="patient-header">
          <div className="patient-avatar">
            <div className="avatar-placeholder">
              {safeData.Name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div className="patient-info">
            <h2 className="patient-name">{safeData.Name}</h2>
            <div className="demographics-row">
              <div className="info-item">
                <strong >ID:</strong>
                <span id="patient-id">{safeData.Member_ID}</span>
              </div>
              <div className="info-item">
                <strong >DOB:</strong>
                <span >{safeData.DOB}</span>
              </div>
              <div className="info-item">
                <strong >Gender:</strong>
                <span >{safeData.Gender}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CriticalItems criticalItems={criticalItems } />
    </div>
  );
};

Demographics.propTypes = {
  memberData: PropTypes.shape({
    ID: PropTypes.string,
    Name: PropTypes.string,
    DOB: PropTypes.string,
    Gender: PropTypes.string,
    Critical_Items: PropTypes.arrayOf(PropTypes.string)
  })
};

Demographics.defaultProps = {
  memberData: null
};

export default Demographics;