import React from 'react';

export const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-inner">
        <div>
          <div style={{ fontWeight: 800, color: 'white', fontSize: '1rem', marginBottom: '4px' }}>
            Semicolon AI — MPLADS Monitoring & Risk Intelligence Platform
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Smart India Hackathon (SIH) | Problem Statement: MoSPI PS 26102 | Developed by <strong>Team Semicolon</strong>
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#94a3b8' }}>
          <div>
            Data Source: <a href="https://mplads.mospi.gov.in/digigov/dashboard.html" target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>Official MoSPI MPLADS e-SAKSHI Portal ↗</a>
          </div>
          <div style={{ color: '#f59e0b', fontWeight: 600, marginTop: '2px' }}>
            Government of India &bull; Ministry of Statistics and Programme Implementation
          </div>
        </div>
      </div>
    </footer>
  );
};
