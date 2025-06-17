import React, { useState, useEffect } from 'react';
import './PatientDetails.css';
import Demographic from './Demographic';
import RiskScoreCard from './RiskScore';
import AWVDueDateSection from './AWVSection';
import CostSummary from './CostSummary';
import QualityMeasures from './QualityMeasures';
import Diagnosis from './Diagnosis';

const MemberInfoDisplay = ({ data }) => {  
  const [diagnosesData, setDiagnosesData] = useState([]);
  const [originalRowData, setOriginalRowData] = useState(null);
  const [awvDueDate, setAwvDueDate] = useState('');

  const memberInfo = data?.['Member Info'] || [];
  const DemoGraphic_Info = memberInfo.DemoGraphic;
  const criticalItems=memberInfo.Critical_Items;
  const RiskScore_Info = memberInfo.RafScore;
  const AWV_Info = memberInfo.AWVSection;
  const OtherInfo = memberInfo.OtherInformation;
  const Quality_Measure_Info = memberInfo.Quality_Measure;
  
  const [qualityMeasures, setQualityMeasures] = useState(() => 
    (Quality_Measure_Info || []).filter(m => 
      m?.measure_name !== "Annual Wellness Visit Care (AWV)"
    )
  );

  useEffect(() => {
    setQualityMeasures(
      (Quality_Measure_Info || []).filter(m => 
        m?.measure_name !== "Annual Wellness Visit Care (AWV)"
      )
    );
  }, [Quality_Measure_Info]);

  const Diagnosis_Info = memberInfo.Diagnosis;

  // Simplified diagnosis data initialization
  useEffect(() => {
    const freshDiagnoses = [...(Diagnosis_Info || [])];
    setDiagnosesData(freshDiagnoses);
  }, [Diagnosis_Info]);

  const calculateGapStatus = (dueDate) => {
    try {
      const currentDate = new Date();
      const due = new Date(dueDate);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      return due >= currentDate && due <= lastDayOfMonth ? "No" : "Yes";
    } catch (error) {
      return "Yes";
    }
  };

  const handleUpdateMeasure = (updatedMeasure) => {
    setQualityMeasures(prev => 
      prev.map(m => 
        m.measure_name === updatedMeasure.measure_name 
          ? { ...m, ...updatedMeasure }  
          : m
      )
    );
  };

  const handleSaveDiagnosis = async (index, newDiagnosis) => {
    try {
      const response = await fetch('http://localhost:7002/api/update-diagnoses', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: DemoGraphic_Info.Member_ID,
          newDiagnosis
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      // Update the diagnosis locally
      const updatedDiagnoses = [...diagnosesData];
      updatedDiagnoses[index] = newDiagnosis;
      setDiagnosesData(updatedDiagnoses);

      console.log('Diagnosis updated successfully');
    } catch (error) {
      console.error('Update failed:', error);

      // Revert changes if something fails
      if (originalRowData) {
        const newData = [...diagnosesData];
        newData[originalRowData.index] = originalRowData;
        setDiagnosesData(newData);
      }

      alert(`Failed to update diagnosis: ${error.message}`);
    } finally {
      setOriginalRowData(null);
    }
  };

  // Compute AWV measure dynamically
  const awvMeasure = {
    measure_name: "Annual Wellness Visit Care (AWV)",
    measure_value: calculateGapStatus(awvDueDate),
    isAWV: true,
    measure_id: 'awv_measure'
  };

  // Combine computed AWV measure with other quality measures
  const measuresToDisplay = [awvMeasure, ...qualityMeasures];

  return (
    <div className="member-info-container">
      <div className='DemoGraphic-Critical-items' style={{display:'flex'}}>
        <Demographic 
              memberData={DemoGraphic_Info} 
              criticalItems={criticalItems} 
            />
      </div>

      <div className='Risk-score-AWV-Other-info'>
        <div className="section risk-score">
          <RiskScoreCard 
            currentRAF={RiskScore_Info.RafScore}
            prevRAF={RiskScore_Info.RafScore}
            scoreGap={RiskScore_Info.RafScore}
          />
        </div>

        <div className="section awv-section">
          <AWVDueDateSection 
            dueDate={AWV_Info.AWV_Due_Date}
            awvCode={AWV_Info.AWV_Code}
            onDateUpdate={setAwvDueDate}
            memberId={DemoGraphic_Info.Member_ID}
          />
        </div>

        <div className="section other-info">
          <div className="info-card">
            <div className="card-header">
              <div className="icon-container">
                <i className="fas fa-info-circle"></i>
              </div>
              <h3>Other Information</h3>
            </div>
            
            <div className="info-content">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-details">
                    <div className="info-label">Medications:</div>
                    <div className="info-value">{OtherInfo.Medications_Cnt}</div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-details">
                    <div className="info-label">RPM Eligible:</div>
                    <div className="info-value">
                      {OtherInfo.RPM_Eligible === 'YES' ? (
                        <span className="eligible">Yes</span>
                      ) : (
                        <span className="not-eligible">No</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className='CostSummary'>
        <CostSummary memberData={memberInfo}/>
      </div>

      <div className='section quality-measures'>
        <QualityMeasures 
          measures={measuresToDisplay} 
          memberId={DemoGraphic_Info.Member_ID}
          onUpdateMeasure={handleUpdateMeasure} 
        />
      </div>

      <Diagnosis className="section diagnoses"
        diagnosesData={diagnosesData}
        onSave={handleSaveDiagnosis}
      />
    </div>
  );
};

export default MemberInfoDisplay;