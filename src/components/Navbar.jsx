import React, { useState } from 'react';
import { 
  Home, 
  LayoutDashboard, 
  MapPin, 
  Bot, 
  CopyCheck, 
  Smartphone, 
  ShieldAlert, 
  ChevronDown, 
  Building2, 
  Landmark, 
  UserCheck, 
  FileText 
} from 'lucide-react';
import { USER_ROLES } from '../data/mpladsData';

export const Navbar = ({ activeTab, setActiveTab, currentRole, setCurrentRole, highRiskCount }) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleIcon = (roleId) => {
    switch (roleId) {
      case 'ministry': return <ShieldAlert size={16} className="text-red-500" />;
      case 'state': return <Building2 size={16} className="text-blue-500" />;
      case 'district': return <Landmark size={16} className="text-amber-500" />;
      case 'mp': return <UserCheck size={16} className="text-emerald-500" />;
      case 'verifier': return <Smartphone size={16} className="text-purple-500" />;
      default: return <UserCheck size={16} />;
    }
  };

  return (
    <>
      <div className="gov-top-bar"></div>
      <div className="gov-sub-bar">
        <span>भारत सरकार | Government of India — Ministry of Statistics and Programme Implementation (MoSPI)</span>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a 
            href="https://mplads.mospi.gov.in/digigov/dashboard.html" 
            target="_blank" 
            rel="noreferrer"
            style={{ color: '#60a5fa', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            Official MoSPI e-SAKSHI Portal ↗
          </a>
          <span style={{ color: '#e2e8f0' }}>|</span>
          <span style={{ color: '#facc15', fontWeight: 700 }}>
            Team Semicolon &bull; SIH PS: 26102
          </span>
          <span style={{ color: '#10b981', fontWeight: 600 }}>● SYSTEM ONLINE</span>
        </div>
      </div>

      <header className="main-header">
        <div className="header-inner">
          <div className="header-brand" onClick={() => setActiveTab('home')}>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="Government of India Emblem" 
              className="emblem-img"
            />
            <div className="brand-text">
              <h1>Members of Parliament Local Area Development Scheme</h1>
              <p>Ministry of Statistics & Programme Implementation Govt. of India</p>
            </div>
          </div>

          <nav>
            <ul className="nav-links">
              <li>
                <button 
                  className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
                  onClick={() => setActiveTab('home')}
                >
                  <Home size={16} /> Home
                </button>
              </li>
              <li>
                <button 
                  className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <LayoutDashboard size={16} /> Dashboard
                </button>
              </li>
              <li>
                <button 
                  className={`nav-btn ${activeTab === 'map' ? 'active' : ''}`}
                  onClick={() => setActiveTab('map')}
                >
                  <MapPin size={16} /> GIS Risk Map
                </button>
              </li>
              <li>
                <button 
                  className={`nav-btn ${activeTab === 'ai-assistant' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ai-assistant')}
                >
                  <Bot size={16} /> AI Assistant
                </button>
              </li>
              <li>
                <button 
                  className={`nav-btn ${activeTab === 'duplicate' ? 'active' : ''}`}
                  onClick={() => setActiveTab('duplicate')}
                >
                  <CopyCheck size={16} /> Duplicate Detection
                </button>
              </li>
              <li>
                <button 
                  className={`nav-btn ${activeTab === 'verification' ? 'active' : ''}`}
                  onClick={() => setActiveTab('verification')}
                >
                  <Smartphone size={16} /> Field Verifier & GST
                </button>
              </li>
              <li>
                <button 
                  className={`nav-btn ${activeTab === 'alerts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('alerts')}
                >
                  <ShieldAlert size={16} /> Cases & Alerts
                  {highRiskCount > 0 && (
                    <span className="badge-risk-count">{highRiskCount}</span>
                  )}
                </button>
              </li>
            </ul>
          </nav>

          <div style={{ position: 'relative' }}>
            <button 
              className="role-pill-btn"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
            >
              {getRoleIcon(currentRole.id)}
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', lineHeight: 1 }}>Role:</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{currentRole.name.split(' ')[0]}</div>
              </div>
              <ChevronDown size={14} style={{ marginLeft: '4px', color: '#64748b' }} />
            </button>

            {showRoleMenu && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: 'white',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                width: '260px',
                zIndex: 1500,
                overflow: 'hidden'
              }}>
                <div style={{ padding: '10px 14px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                  SWITCH USER ROLE / PORTAL
                </div>
                {USER_ROLES.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => {
                      setCurrentRole(role);
                      setShowRoleMenu(false);
                    }}
                    style={{
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      background: currentRole.id === role.id ? '#eff6ff' : 'white',
                      borderLeft: currentRole.id === role.id ? '3px solid #2563eb' : '3px solid transparent',
                      transition: 'background 0.15s'
                    }}
                  >
                    {getRoleIcon(role.id)}
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>{role.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{role.badge}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
