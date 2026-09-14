import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { NationalKpiBar } from './components/NationalKpiBar';
import { LeadershipSection } from './components/LeadershipSection';
import { DashboardView } from './components/DashboardView';
import { GisRiskMapView } from './components/GisRiskMapView';
import { AiInvestigationAssistant } from './components/AiInvestigationAssistant';
import { DuplicateDetectionView } from './components/DuplicateDetectionView';
import { FieldVerificationPortal } from './components/FieldVerificationPortal';
import { AlertsCasesKanban } from './components/AlertsCasesKanban';
import { Footer } from './components/Footer';
import { USER_ROLES } from './data/mpladsData';

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentRole, setCurrentRole] = useState(USER_ROLES[0]); // Default: Ministry / Admin
  const [highRiskCount, setHighRiskCount] = useState(142);
  const [inspectedProject, setInspectedProject] = useState(null);

  const handleAssignVerifier = (project) => {
    setActiveTab('verification');
  };

  const handleVerificationComplete = (projectId) => {
    setHighRiskCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top MoSPI Header & Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        highRiskCount={highRiskCount}
      />

      {/* Role Context Bar */}
      <div style={{
        background: '#eff6ff',
        borderBottom: '1px solid #dbeafe',
        padding: '6px 24px',
        fontSize: '0.78rem',
        color: '#1e40af',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <span>
            Active View: <strong>{currentRole.name}</strong> &bull; Level: <strong>{currentRole.badge}</strong>
          </span>
          <span>
            e-SAKSHI Synchronization: <strong>Live API Feed</strong> (Last synced: Just now)
          </span>
        </div>
      </div>

      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {/* Tab 1: Home (Matches Figma Frame 2.png layout completely) */}
        {activeTab === 'home' && (
          <>
            <HeroSection />
            <NationalKpiBar 
              onInspectAnomalies={() => setActiveTab('alerts')}
              onOpenMap={() => setActiveTab('map')}
            />
            <LeadershipSection />
            
            <div style={{ maxWidth: '1400px', margin: '0 auto 20px', padding: '0 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0f172a' }}>National MPLADS Analytics & MP Directory</h2>
                <button 
                  className="btn-primary" 
                  onClick={() => setActiveTab('dashboard')}
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  Open Full Dashboard View →
                </button>
              </div>
            </div>
            
            <DashboardView onSelectProject={(p) => { setInspectedProject(p); setActiveTab('map'); }} />
          </>
        )}

        {/* Tab 2: Dashboard (Full Sector Donut + Pipeline + MP Drilldown) */}
        {activeTab === 'dashboard' && (
          <div style={{ paddingTop: '20px' }}>
            <DashboardView onSelectProject={(p) => { setInspectedProject(p); setActiveTab('map'); }} />
          </div>
        )}

        {/* Tab 3: Interactive Leaflet GIS Risk Map */}
        {activeTab === 'map' && (
          <div style={{ paddingTop: '20px' }}>
            <GisRiskMapView onAssignVerifier={handleAssignVerifier} />
          </div>
        )}

        {/* Tab 4: AI Investigation Assistant */}
        {activeTab === 'ai-assistant' && (
          <div style={{ paddingTop: '20px' }}>
            <AiInvestigationAssistant onSelectProject={(p) => { setInspectedProject(p); setActiveTab('map'); }} />
          </div>
        )}

        {/* Tab 5: Duplicate Work Detection */}
        {activeTab === 'duplicate' && (
          <div style={{ paddingTop: '20px' }}>
            <DuplicateDetectionView onAssignVerifier={handleAssignVerifier} />
          </div>
        )}

        {/* Tab 6: Field Verification & GST QR Portal */}
        {activeTab === 'verification' && (
          <div style={{ paddingTop: '20px' }}>
            <FieldVerificationPortal onVerificationComplete={handleVerificationComplete} />
          </div>
        )}

        {/* Tab 7: Alerts & Case Management */}
        {activeTab === 'alerts' && (
          <div style={{ paddingTop: '20px' }}>
            <AlertsCasesKanban />
          </div>
        )}
      </main>

      {/* Official MoSPI Footer */}
      <Footer />
    </div>
  );
}
export default App;
