import React, { useState } from 'react';
import { FileText, PlayCircle, X, ExternalLink, Award } from 'lucide-react';

export const HeroSection = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

  return (
    <section className="hero-section">
      <div className="hero-grid">
        <div className="hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#1d4ed8', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '14px', border: '1px solid #bfdbfe' }}>
            <Award size={14} /> Team Semicolon — Smart India Hackathon Innovation Project
          </div>
          <h2>What is MPLADS?</h2>
          <p>
            MPLADS was formulated by the Government of India on 23 December 1993.
            The main objective of the Scheme is to allow each Member of Parliament (MP)
            to facilitate developmental projects in their constituencies with an emphasis
            on creating durable community assets based on locally felt needs.
          </p>

          <div className="hero-actions">
            <button
              className="btn-hero-action"
              onClick={() => setShowGuidelinesModal(true)}
            >
              <FileText size={18} color="#0284c7" />
              <span>Official Guidelines</span>
            </button>

            <button
              className="btn-hero-action"
              onClick={() => setShowVideoModal(true)}
            >
              <PlayCircle size={18} color="#ef4444" />
              <span>Explainer Video</span>
            </button>

            <a
              href="https://mplads.mospi.gov.in/digigov/dashboard.html"
              target="_blank"
              rel="noreferrer"
              className="btn-hero-action"
              style={{ textDecoration: 'none' }}
            >
              <ExternalLink size={18} color="#16a34a" />
              <span>MoSPI Dashboard ↗</span>
            </a>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1583608563020-9772ff491a8c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwcGFybGltZW50fGVufDB8fDB8fHww"
            alt="New Parliament Building of India"
            className="hero-image"
          />
          <div className="hero-image-badge">
            🏛️ New Parliament House, New Delhi
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="modal-overlay" onClick={() => setShowVideoModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>MPLADS Scheme & AI Intelligence Overview</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div style={{ background: '#0f172a', borderRadius: '12px', padding: '40px 20px', color: 'white', marginBottom: '16px' }}>
                <PlayCircle size={64} style={{ color: '#f59e0b', margin: '0 auto 16px' }} />
                <h4 style={{ color: 'white', marginBottom: '8px' }}>Semicolon AI — Transforming MPLADS via e-SAKSHI</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '480px', margin: '0 auto' }}>
                  An AI decision-support platform engineered by Team Semicolon demonstrating real-time anomaly detection, duplicate work order isolation, and GPS-verified ground auditing for MoSPI.
                </p>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Simulated demo video asset for SIH Presentation & Jury evaluation by Team Semicolon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Guidelines Modal */}
      {showGuidelinesModal && (
        <div className="modal-overlay" onClick={() => setShowGuidelinesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Official MPLADS Guidelines Summary (MoSPI)</h3>
              <button
                onClick={() => setShowGuidelinesModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <ul style={{ paddingLeft: '20px', fontSize: '0.86rem', color: '#334155', lineHeight: '1.8' }}>
                <li><strong>Annual Entitlement:</strong> ₹5 Crore per MP per annum released in two installments of ₹2.5 Crore each by MoSPI.</li>
                <li><strong>Non-Lapsable Nature:</strong> Funds are non-lapsable and carry forward across financial years.</li>
                <li><strong>SC/ST Mandatory Focus:</strong> At least 15% of annual funds must create assets in Scheduled Caste areas and 7.5% in Scheduled Tribe areas.</li>
                <li><strong>Scheme Convergence:</strong> Permissible convergence with MGNREGS for durable assets and Khelo India for sports infrastructure.</li>
                <li><strong>Prohibited Works:</strong> Private societies where the MP or family members are office-bearers; purely commercial installations.</li>
                <li><strong>Role of Semicolon AI:</strong> Operates as the intelligent risk layer on top of e-SAKSHI data to detect anomalies and assist district collectors.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
