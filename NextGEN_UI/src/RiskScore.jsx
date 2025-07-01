import './RiskScore.css';

const RiskScoreCard = ({ currentRAF = 1.038, prevRAF = 3.664, scoreGap = 2.626 }) => {
  const progress = (currentRAF / 5) * 314.16;
  const strokeDashoffset = 314.16 - progress;
  const isImproved = currentRAF < prevRAF;

  return (
    <div className="risk-card">
      <div className="card-header">
        <div className="icon-container">
          <i className="fas fa-chart-line"></i>
        </div>
        <h3>Risk Score Analysis</h3>
      </div>
      
      <div className="risk-content">
        <div className="radial-container">
          <div className="radial-progress">
                <svg width="100" height="100" viewBox="0 0 120 120">
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" className="progress-gradient" />
                    <stop offset="100%" className="progress-gradient-end" />
                    </linearGradient>
                </defs>
                <circle className="radial-progress-circle radial-progress-background" cx="60" cy="60" r="50"/>
                <circle 
                    className="radial-progress-circle radial-progress-value" 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    style={{ strokeDasharray: 314.16, strokeDashoffset }}
                />
                </svg>
                <div className="radial-label">
                <div className="current-value">{currentRAF.toFixed(3)}</div>
                <div className="value-label">Current RAF</div>
                </div>
          </div>
          
          <div className="score-change">
            <div className={`change-indicator ${isImproved ? 'positive' : 'negative'}`}>
              {isImproved ? '▼ Improvement' : '▲ Increase'}
            </div>
            <div className="change-value">{Math.abs(scoreGap).toFixed(3)}</div>
          </div>
        </div>
        
        <div className="score-details">
          <div className="score-item">
            <span className="score-label">Previous RAF</span>
            <span className="score-value">{prevRAF.toFixed(3)}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Score Gap</span>
            <span className={`score-value ${isImproved ? 'positive' : 'negative'}`}>
              {isImproved ? '▼' : '▲'} {Math.abs(scoreGap).toFixed(3)}
            </span>
          </div>
          <div className="score-item">
            <span className="score-label">Risk Level</span>
            <span className="score-value">
              {currentRAF < 2.0 ? 'Low' : currentRAF < 3.5 ? 'Medium' : 'High'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskScoreCard;