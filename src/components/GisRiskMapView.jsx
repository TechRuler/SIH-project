import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MPLADS_PROJECTS } from '../data/mpladsData';
import { ShieldAlert, Filter, AlertTriangle, CheckCircle, Navigation, Eye, UserCheck } from 'lucide-react';

export const GisRiskMapView = ({ onAssignVerifier }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [selectedRiskFilter, setSelectedRiskFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter projects
  const filteredProjects = MPLADS_PROJECTS.filter((p) => {
    const matchesRisk = selectedRiskFilter === 'All' || p.riskLevel === selectedRiskFilter;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesRisk && matchesCategory;
  });

  // Helper to get color code
  const getMarkerColor = (level) => {
    switch (level) {
      case 'Critical': return '#ef4444'; // Red
      case 'High': return '#f97316';     // Orange
      case 'Medium': return '#f59e0b';   // Yellow
      case 'Low': return '#10b981';      // Green
      default: return '#3b82f6';
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map if not already initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [21.5, 78.9629], // Center of India
        zoom: 5,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Team Semicolon (MoSPI e-SAKSHI)',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    // Render Markers
    filteredProjects.forEach((proj) => {
      const color = getMarkerColor(proj.riskLevel);
      const isCritical = proj.riskLevel === 'Critical';

      // Custom HTML Marker with pulsing glow for critical
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            position: relative;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            ${isCritical ? `
              <div style="
                position: absolute;
                width: 38px;
                height: 38px;
                border-radius: 50%;
                background: rgba(239, 68, 68, 0.4);
                animation: pulse-danger 1.8s infinite;
              "></div>
            ` : ''}
            <div style="
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: ${color};
              border: 2.5px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 10px;
              font-weight: 800;
            ">
              ${proj.riskScore}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([proj.lat, proj.lng], { icon: customIcon }).addTo(map);

      // Popup content
      const popupHtml = `
        <div style="font-family: sans-serif; min-width: 240px; padding: 4px;">
          <div style="font-size: 11px; font-weight: 700; color: ${color}; text-transform: uppercase; margin-bottom: 2px;">
            ● ${proj.riskLevel} Risk (${proj.riskScore}/100)
          </div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px; line-height: 1.3;">
            ${proj.workName}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
            ${proj.district}, ${proj.state} | ID: ${proj.id}
          </div>
          <div style="background: #f8fafc; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 11px; margin-bottom: 8px;">
            <div><strong>Sanction:</strong> ₹ ${(proj.sanctionedAmount / 100000).toFixed(2)} L | <strong>Spent:</strong> ₹ ${(proj.expenditure / 100000).toFixed(2)} L</div>
            <div><strong>Progress:</strong> ${proj.progressPercent}% | <strong>Status:</strong> ${proj.status}</div>
          </div>
          ${proj.anomalyType !== 'None (Verified Genuine)' ? `
            <div style="background: #fef2f2; color: #991b1b; padding: 6px 8px; border-radius: 4px; font-size: 11px; margin-bottom: 8px; border-left: 3px solid #ef4444;">
              <strong>Anomaly:</strong> ${proj.anomalyType}
            </div>
          ` : ''}
          <div style="font-size: 10px; color: #64748b; margin-bottom: 8px;">
            Contractor: <strong>${proj.contractorName}</strong>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        setSelectedProject(proj);
      });

      markersRef.current.push(marker);
    });

  }, [filteredProjects]);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
      
      {/* Title & Filter Header */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Navigation size={20} color="#2563eb" />
            Geographic Fraud Detection & GIS Intelligence Map
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
            Visualizing sanctioned MPLADS projects across India with real-time AI Risk Classification.
          </p>
        </div>

        {/* Risk Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Filter Risk:</span>
          
          <button 
            onClick={() => setSelectedRiskFilter('All')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid #cbd5e1',
              background: selectedRiskFilter === 'All' ? '#0f172a' : 'white',
              color: selectedRiskFilter === 'All' ? 'white' : '#334155'
            }}
          >
            All ({MPLADS_PROJECTS.length})
          </button>

          <button 
            onClick={() => setSelectedRiskFilter('Critical')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid #fca5a5',
              background: selectedRiskFilter === 'Critical' ? '#ef4444' : '#fef2f2',
              color: selectedRiskFilter === 'Critical' ? 'white' : '#b91c1c'
            }}
          >
            🔴 Critical (81-100)
          </button>

          <button 
            onClick={() => setSelectedRiskFilter('High')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid #fdba74',
              background: selectedRiskFilter === 'High' ? '#f97316' : '#fff7ed',
              color: selectedRiskFilter === 'High' ? 'white' : '#c2410c'
            }}
          >
            🟠 High (61-80)
          </button>

          <button 
            onClick={() => setSelectedRiskFilter('Medium')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid #fde68a',
              background: selectedRiskFilter === 'Medium' ? '#f59e0b' : '#fffbeb',
              color: selectedRiskFilter === 'Medium' ? 'white' : '#b45309'
            }}
          >
            🟡 Medium (31-60)
          </button>

          <button 
            onClick={() => setSelectedRiskFilter('Low')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid #a7f3d0',
              background: selectedRiskFilter === 'Low' ? '#10b981' : '#ecfdf5',
              color: selectedRiskFilter === 'Low' ? 'white' : '#047857'
            }}
          >
            🟢 Low (0-30)
          </button>
        </div>
      </div>

      {/* Map + Detail Inspector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedProject ? '1.8fr 1fr' : '1fr', gap: '24px' }}>
        
        {/* Leaflet Map Box */}
        <div style={{ position: 'relative' }}>
          <div ref={mapContainerRef} className="map-container" />

          {/* Map Floating Legend */}
          <div className="map-legend-overlay">
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase' }}>
              Risk Scoring Index (0-100)
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#ef4444' }}></div>
              <span>Critical (81–100) — Immediate Audit</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#f97316' }}></div>
              <span>High (61–80) — Contractor Monopoly / Overrun</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#f59e0b' }}></div>
              <span>Medium (31–60) — Delay Warning</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: '#10b981' }}></div>
              <span>Low (0–30) — Verified Genuine Progress</span>
            </div>
          </div>
        </div>

        {/* Selected Project Inspector Panel */}
        {selectedProject && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className={`risk-badge ${selectedProject.riskLevel.toLowerCase()}`}>
                  {selectedProject.riskLevel} Risk ({selectedProject.riskScore}/100)
                </span>
                <button 
                  onClick={() => setSelectedProject(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  ✕
                </button>
              </div>

              <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '6px' }}>
                {selectedProject.workName}
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '16px' }}>
                Work ID: <strong>{selectedProject.id}</strong> | MP: <strong>{selectedProject.mpName}</strong>
              </div>

              {/* Financial Box */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ color: '#64748b' }}>Sanction Amount:</div>
                    <div style={{ fontWeight: 800, color: '#047857' }}>
                      ₹ {(selectedProject.sanctionedAmount / 100000).toFixed(2)} Lakhs
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b' }}>Expenditure Drawn:</div>
                    <div style={{ fontWeight: 800, color: '#1e40af' }}>
                      ₹ {(selectedProject.expenditure / 100000).toFixed(2)} Lakhs
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginBottom: '4px' }}>
                    <span>Physical Progress</span>
                    <span style={{ fontWeight: 700 }}>{selectedProject.progressPercent}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedProject.progressPercent}%`, height: '100%', background: selectedProject.progressPercent > 80 ? '#10b981' : '#f59e0b' }}></div>
                  </div>
                </div>
              </div>

              {/* AI Anomaly Explanation */}
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800, color: '#991b1b', marginBottom: '4px' }}>
                  <AlertTriangle size={15} />
                  <span>AI Risk Trigger: {selectedProject.anomalyType}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#7f1d1d', margin: 0, lineHeight: 1.5 }}>
                  {selectedProject.aiExplanation}
                </p>
              </div>

              {/* Contractor Info */}
              <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '16px' }}>
                <div>Contractor: <strong>{selectedProject.contractorName}</strong></div>
                <div>GSTIN: <code>{selectedProject.contractorGstin}</code> | PAN: <code>{selectedProject.contractorPan}</code></div>
                <div>Invoice IRN: <span style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>{selectedProject.gstInvoice.irn.slice(0, 24)}...</span></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                onClick={() => {
                  onAssignVerifier(selectedProject);
                  alert(`Case created for ${selectedProject.id}. Assigned to District Field Verifier with GPS geofence enabled.`);
                }}
              >
                <UserCheck size={14} /> Assign Field Verifier
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
