import React from 'react';
import { NATIONAL_KPIS } from '../data/mpladsData';
import { AlertTriangle, AlertCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const NationalKpiBar = ({ onInspectAnomalies, onOpenMap }) => {
  const formatCurrency = (val) => {
    return '₹ ' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <>
      <div className="kpi-banner">
        <div className="kpi-banner-inner">
          <div className="kpi-item">
            <div className="kpi-label">Allocated Limit</div>
            <div className="kpi-value">{formatCurrency(NATIONAL_KPIS.allocatedLimit)}</div>
          </div>
          <div className="kpi-item">
            <div className="kpi-label">Total Expenditure</div>
            <div className="kpi-value">{formatCurrency(NATIONAL_KPIS.totalExpenditure)}</div>
          </div>
          <div className="kpi-item">
            <div className="kpi-label">Total Works Recommended</div>
            <div className="kpi-value">{NATIONAL_KPIS.worksRecommended.toLocaleString('en-IN')}</div>
          </div>
          <div className="kpi-item">
            <div className="kpi-label">Total Works Completed</div>
            <div className="kpi-value">{NATIONAL_KPIS.worksCompleted.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* AI Risk Intelligence Alert Strip (Nirikshak AI differentiator) */}
      <div className="ai-risk-strip">
        <div className="ai-risk-strip-inner">
          <div className="ai-risk-left">
            <span className="ai-pill-tag">AI Risk Alert</span>
            <div>
              <span className="ai-risk-title">
                142 Anomalous Works Flagged Across Active Parliamentary Constituencies
              </span>
              <div className="ai-risk-subtitle">
                e-SAKSHI automated risk audit: 28 duplicate works, 41 cost escalations &gt;50%, 73 stalled assets
              </div>
            </div>
          </div>

          <div className="ai-risk-metrics">
            <div className="ai-mini-stat" style={{ color: '#ef4444' }}>
              <AlertTriangle size={15} />
              <span>{NATIONAL_KPIS.flaggedHighRisk} High-Risk</span>
            </div>
            <div className="ai-mini-stat" style={{ color: '#f97316' }}>
              <AlertCircle size={15} />
              <span>{NATIONAL_KPIS.suspectedDuplicates} Duplicates</span>
            </div>
            <div className="ai-mini-stat" style={{ color: '#d97706' }}>
              <Zap size={15} />
              <span>{NATIONAL_KPIS.activeEarlyWarnings} Early Warnings</span>
            </div>

            <button 
              onClick={onInspectAnomalies}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(220,38,38,0.2)'
              }}
            >
              Inspect Anomaly Dossier <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
