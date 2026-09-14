import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight, UserCheck, CheckCircle2, Clock, FileText, ChevronRight } from 'lucide-react';
import { MPLADS_PROJECTS } from '../data/mpladsData';

export const AlertsCasesKanban = () => {
  const [cases, setCases] = useState([
    {
      id: 'CASE-2023-01',
      projectId: 'MPL-2023-20184',
      title: 'Multipurpose Community Welfare Hall, Chandni Chowk',
      type: 'Severe Cost Overrun (174%)',
      stage: 'new', // new, assigned, verified, escalated
      riskScore: 94,
      state: 'Delhi',
      assignedTo: 'Unassigned',
      date: '10-Sep-2023'
    },
    {
      id: 'CASE-2023-02',
      projectId: 'MPL-2023-10491',
      title: 'Construction of CC Road, Nagpur',
      type: 'Duplicate Work & Billing (94% Match)',
      stage: 'assigned',
      riskScore: 89,
      state: 'Maharashtra',
      assignedTo: 'Inspector R. Deshmukh',
      date: '08-Sep-2023'
    },
    {
      id: 'CASE-2023-03',
      projectId: 'MPL-2023-40192',
      title: 'Supply of 50 Deep Borewell Systems, Varanasi',
      type: 'Fake GSTIN / Bogus Invoice',
      stage: 'assigned',
      riskScore: 91,
      state: 'Uttar Pradesh',
      assignedTo: 'Inspector V. Tripathi',
      date: '05-Sep-2023'
    },
    {
      id: 'CASE-2023-04',
      projectId: 'MPL-2023-30512',
      title: 'Solar Street Lights Tender Monopoly',
      type: 'Contractor Cartelization',
      stage: 'verified',
      riskScore: 88,
      state: 'Maharashtra',
      assignedTo: 'Inspector S. Shinde',
      date: '01-Sep-2023'
    },
    {
      id: 'CASE-2023-05',
      projectId: 'MPL-2023-50911',
      title: 'Dr. B.R. Ambedkar Skill Center, Ahmednagar',
      type: 'Stalled SC/ST Mandatory Asset',
      stage: 'escalated',
      riskScore: 78,
      state: 'Maharashtra',
      assignedTo: 'District Collector Office',
      date: '28-Aug-2023'
    }
  ]);

  const moveCase = (caseId, newStage) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, stage: newStage } : c))
    );
  };

  const getStageName = (stage) => {
    switch (stage) {
      case 'new': return 'New AI Anomaly Flagged';
      case 'assigned': return 'Field Verifier Assigned';
      case 'verified': return 'Ground Evidence Audited';
      case 'escalated': return 'Escalated to Vigilance / CAG';
      default: return stage;
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
      
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={22} color="#dc2626" />
            Vigilance Alerts & Case Management Workflow
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
            End-to-end audit lifecycle from AI anomaly discovery to disciplinary escalation.
          </p>
        </div>

        <span style={{ fontSize: '0.8rem', background: '#fef2f2', color: '#991b1b', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, border: '1px solid #fecaca' }}>
          {cases.length} Active Vigilance Dossiers
        </span>
      </div>

      {/* 4-Stage Kanban Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        
        {['new', 'assigned', 'verified', 'escalated'].map((stageKey) => {
          const stageCases = cases.filter((c) => c.stage === stageKey);
          
          let colBorder = '#e2e8f0';
          let colHeaderBg = '#f8fafc';
          let colTitleColor = '#334155';

          if (stageKey === 'new') { colBorder = '#fecaca'; colHeaderBg = '#fef2f2'; colTitleColor = '#991b1b'; }
          if (stageKey === 'assigned') { colBorder = '#fed7aa'; colHeaderBg = '#fff7ed'; colTitleColor = '#c2410c'; }
          if (stageKey === 'verified') { colBorder = '#bfdbfe'; colHeaderBg = '#eff6ff'; colTitleColor = '#1d4ed8'; }
          if (stageKey === 'escalated') { colBorder = '#bbf7d0'; colHeaderBg = '#f0fdf4'; colTitleColor = '#15803d'; }

          return (
            <div 
              key={stageKey}
              style={{
                background: '#ffffff',
                border: `1.5px solid ${colBorder}`,
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{
                background: colHeaderBg,
                padding: '12px 16px',
                borderBottom: `1px solid ${colBorder}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: colTitleColor }}>
                  {getStageName(stageKey)}
                </span>
                <span style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  border: `1px solid ${colBorder}`
                }}>
                  {stageCases.length}
                </span>
              </div>

              <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stageCases.map((item) => (
                  <div 
                    key={item.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '14px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb' }}>{item.id}</span>
                      <span className="risk-badge critical" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                        Risk: {item.riskScore}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                      {item.title}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>
                      ⚠️ {item.type}
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px dashed #e2e8f0' }}>
                      <span>{item.state}</span>
                      <span>Assigned: <strong>{item.assignedTo}</strong></span>
                    </div>

                    {/* Progress Workflow Action */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      {stageKey === 'new' && (
                        <button 
                          style={{ flex: 1, background: '#ea580c', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                          onClick={() => moveCase(item.id, 'assigned')}
                        >
                          Assign Verifier →
                        </button>
                      )}
                      {stageKey === 'assigned' && (
                        <button 
                          style={{ flex: 1, background: '#2563eb', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                          onClick={() => moveCase(item.id, 'verified')}
                        >
                          Mark Field Verified →
                        </button>
                      )}
                      {stageKey === 'verified' && (
                        <button 
                          style={{ flex: 1, background: '#16a34a', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                          onClick={() => moveCase(item.id, 'escalated')}
                        >
                          Escalate / Close Case →
                        </button>
                      )}
                      {stageKey === 'escalated' && (
                        <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700, textAlign: 'center', width: '100%' }}>
                          ✓ Dossier Submitted to CAG
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {stageCases.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem', padding: '30px 10px', fontStyle: 'italic' }}>
                    No dossiers in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
};
