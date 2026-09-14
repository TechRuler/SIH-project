import React, { useState } from 'react';
import { CopyCheck, AlertTriangle, ArrowRightLeft, ShieldAlert, CheckCircle2, MapPin, Building, Calendar, DollarSign } from 'lucide-react';
import { DUPLICATE_WORKS_PAIRS } from '../data/mpladsData';

export const DuplicateDetectionView = ({ onAssignVerifier }) => {
  const [pairs, setPairs] = useState(DUPLICATE_WORKS_PAIRS);
  const [resolvedPairs, setResolvedPairs] = useState([]);

  const handleFlagCase = (pairId) => {
    setResolvedPairs((prev) => [...prev, pairId]);
    alert(`Case escalated for ${pairId}. Work order payments placed on administrative freeze pending physical vigilance inspection.`);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
      
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CopyCheck size={22} color="#ef4444" />
            Duplicate Work & Ghost Project Detection Engine
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
            Combining Semantic NLP Description Matching with GPS Geofencing to detect double billing on the same public infrastructure.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', background: '#fef2f2', color: '#b91c1c', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, border: '1px solid #fecaca' }}>
            ⚠️ {pairs.length} Suspected Duplicate Clusters Flagged
          </span>
        </div>
      </div>

      {/* Duplicate Pairs Cards */}
      {pairs.map((pair) => {
        const isResolved = resolvedPairs.includes(pair.id);

        return (
          <div key={pair.id} className="duplicate-pair-card">
            <div className="duplicate-pair-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ background: '#ef4444', color: 'white', padding: '3px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                  PAIR #{pair.id}
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                  {pair.district}, {pair.state}
                </span>
                <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                  GPS Distance: {pair.distanceMeters} meters
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>AI Match Confidence</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#b91c1c' }}>{pair.confidenceScore}%</div>
                </div>
              </div>
            </div>

            {/* AI Explanation Banner */}
            <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fca5a5', marginBottom: '16px', fontSize: '0.8rem', color: '#7f1d1d' }}>
              <strong>AI Match Explanation:</strong> {pair.reason}
            </div>

            {/* Side-by-Side Comparison */}
            <div className="duplicate-grid">
              
              {/* Work A */}
              <div className="work-box flagged">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#991b1b' }}>WORK ORDER A (LATER TENDER)</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>{pair.workA.id}</span>
                </div>

                <h4 style={{ fontSize: '0.92rem', color: '#0f172a', marginBottom: '10px', minHeight: '44px' }}>
                  {pair.workA.title}
                </h4>

                <div style={{ fontSize: '0.76rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={14} color="#047857" />
                    <span>Sanction Amount: <strong>{pair.workA.amount}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#2563eb" />
                    <span>Sanction Date: {pair.workA.sanctionDate}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={14} color="#f59e0b" />
                    <span>Contractor: <strong>{pair.workA.contractor}</strong></span>
                  </div>
                  <div style={{ marginTop: '4px', fontWeight: 700, color: '#dc2626' }}>
                    Status: {pair.workA.status}
                  </div>
                </div>
              </div>

              {/* Work B */}
              <div className="work-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#047857' }}>WORK ORDER B (PREVIOUS TENDER)</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>{pair.workB.id}</span>
                </div>

                <h4 style={{ fontSize: '0.92rem', color: '#0f172a', marginBottom: '10px', minHeight: '44px' }}>
                  {pair.workB.title}
                </h4>

                <div style={{ fontSize: '0.76rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={14} color="#047857" />
                    <span>Sanction Amount: <strong>{pair.workB.amount}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#2563eb" />
                    <span>Sanction Date: {pair.workB.sanctionDate}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={14} color="#f59e0b" />
                    <span>Contractor: <strong>{pair.workB.contractor}</strong></span>
                  </div>
                  <div style={{ marginTop: '4px', fontWeight: 700, color: '#16a34a' }}>
                    Status: {pair.workB.status}
                  </div>
                </div>
              </div>

            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #fee2e2' }}>
              {isResolved ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '0.85rem' }}>
                  <CheckCircle2 size={16} /> Payment Frozen & Case Escalated to Vigilance / CAG
                </div>
              ) : (
                <>
                  <button 
                    style={{
                      background: 'white',
                      border: '1px solid #cbd5e1',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: '#475569'
                    }}
                    onClick={() => alert(`Marked ${pair.id} as verified exception under special technical sanction.`)}
                  >
                    Dismiss as Legitimate Extension
                  </button>

                  <button 
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onClick={() => handleFlagCase(pair.id)}
                  >
                    <ShieldAlert size={15} /> Freeze Payment & Trigger Ground Audit
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}

    </div>
  );
};
