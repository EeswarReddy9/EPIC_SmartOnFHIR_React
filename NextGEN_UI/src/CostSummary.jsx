import './CostSummary.css';

const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

const calculatePercentageChange = (previous, current) => {
    const prev = parseFloat(previous);
    const curr = parseFloat(current);
    if (prev === 0) return '▲ 100%';
    const change = ((curr - prev) / prev) * 100;
    return `${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(1)}%`;
  };

const CostSummary = ({ memberData }) => {
return (
<div className="section cost-summary">
        <h3>$ Cost Summary</h3>
        <div className="cost-grid">
          <div className="cost-card emergency">
            <div className="card-header">
              <h4>
              <i className="fas fa-briefcase-medical"></i>
              Emergency Room</h4>
            </div>
            <div className="card-body">
              <div className="cost-item">
                <span>12 Month Visits</span>
                <strong>{memberData.ER_Visits.ER_Visits_12}</strong>
              </div>
              <div className="cost-item">
                <span>3 Month Visits</span>
                <strong>{memberData.ER_Visits.ER_Visits_3}</strong>
              </div>
              <div className="cost-item highlight">
                <span>Total Costs</span>
                <strong>{formatCurrency(memberData.ER_Costs.ERcost_0)}</strong>
              </div>
            </div>
          </div>

          <div className="cost-card inpatient">
            <div className="card-header">
              <h4>
              <i className="fas fa-bed"></i>
              Inpatient</h4>
            </div>
            <div className="card-body">
              <div className="cost-item">
                <span>12 Month Visits</span>
                <strong>{memberData.IP_Visits.IP_Visits_12}</strong>
              </div>
              <div className="cost-item">
                <span>3 Month Visits</span>
                <strong>{memberData.IP_Visits.IP_Visits_3}</strong>
              </div>
              <div className="cost-item highlight">
                <span>Total Costs</span>
                <strong>{formatCurrency(memberData.IP_Cost.IPcost_0)}</strong>
              </div>
            </div>
          </div>

          <div className="cost-card other-costs">
            <div className="card-header">
              <h4><i className="fas fa-sack-dollar"></i>Other Costs</h4>
            </div>
            <div className="card-body">
              <div className="cost-item">
                <span>Total</span>
                <strong>{formatCurrency(memberData.Other_Costs.OTcost_0)}</strong>
              </div>
              <div className="cost-item">
                <span>Specialty</span>
                <strong>{formatCurrency(memberData.OtherInformation.Spec_Cost)}</strong>
              </div>
              <div className="cost-item highlight">
                <span>High Cost</span>
                <strong>{formatCurrency(memberData.OtherInformation.High_Cost)}</strong>
              </div>
            </div>
          </div>

          <div className="cost-card total-costs">
            <div className="card-header">
              <h4><i className="fas fa-coins"></i> Total Costs</h4>
            </div>
            <div className="card-body">
              <div className="cost-item trend-up">
                <span>Current</span>
                <strong>{formatCurrency(memberData.Total_Costs.Totalcost_0)}</strong>
              </div>
              <div className="cost-item trend-down">
                <span>Previous</span>
                <strong>{formatCurrency(memberData.Total_Costs.Totalcost_1)}</strong>
              </div>
              <div className="cost-item difference">
                <span>Change</span>
                <strong>
                  {calculatePercentageChange(
                    memberData.Total_Costs.Totalcost_1,
                    memberData.Total_Costs.Totalcost_0
                  )}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default CostSummary
