import React, { useState } from 'react';
import { 
  MP_PROFILES, 
  SECTOR_DISTRIBUTION, 
  ADMINISTRATIVE_FUNDS, 
  WORK_STATUS_PIPELINE,
  MPLADS_PROJECTS 
} from '../data/mpladsData';
import { 
  Search, 
  Filter, 
  Coins, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Building, 
  MapPin, 
  FileSpreadsheet, 
  Download, 
  ChevronRight,
  User,
  PieChart as PieIcon,
  TrendingUp,
  Layers
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export const DashboardView = ({ onSelectProject }) => {
  const [selectedHouse, setSelectedHouse] = useState('Lok Sabha');
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [selectedMp, setSelectedMp] = useState(MP_PROFILES[0]);
  const [selectedTab, setSelectedTab] = useState('overview'); // overview, mps, funds, pipeline

  // Filter MPs based on house, query, and state
  const filteredMps = MP_PROFILES.filter((mp) => {
    const matchesHouse = selectedHouse === 'All' || mp.house === selectedHouse;
    const matchesState = stateFilter === 'All' || mp.state === stateFilter;
    const matchesSearch = 
      mp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mp.constituency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mp.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesHouse && matchesState && matchesSearch;
  });

  // Donut chart config matching Figma Frame 2 exact slices
  const doughnutData = {
    labels: SECTOR_DISTRIBUTION.map(s => s.name),
    datasets: [
      {
        data: SECTOR_DISTRIBUTION.map(s => s.percentage),
        backgroundColor: [
          '#3b82f6', // Infrastructure (48.2%)
          '#f97316', // Agriculture (24.8%)
          '#eab308', // Education (11.3%)
          '#6366f1', // Handloom (10.9%)
          '#06b6d4', // Health (8.4%)
          '#10b981', // Sports (4.8%)
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: { size: 11, family: 'Plus Jakarta Sans', weight: '600' },
          padding: 12
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return ` ${context.label}: ${context.raw}% (${SECTOR_DISTRIBUTION[context.dataIndex].funds})`;
          }
        }
      }
    },
    cutout: '68%',
  };

  return (
    <div className="dashboard-content" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
      
      {/* House Tabs & Search Filter Controls (Matching Figma Frame 2) */}
      <div className="dashboard-controls" style={{ padding: 0, marginBottom: '24px' }}>
        <div className="house-tabs">
          <button 
            className={`house-tab-btn ${selectedHouse === 'Lok Sabha' ? 'active' : ''}`}
            onClick={() => setSelectedHouse('Lok Sabha')}
          >
            17th Lok Sabha
          </button>
          <button 
            className={`house-tab-btn ${selectedHouse === 'Rajya Sabha' ? 'active' : ''}`}
            onClick={() => setSelectedHouse('Rajya Sabha')}
          >
            Rajya Sabha
          </button>
          <button 
            className={`house-tab-btn ${selectedHouse === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedHouse('All')}
          >
            All Houses
          </button>
        </div>

        <div className="search-filter-bar">
          <div className="search-input-wrap">
            <Search size={16} color="#64748b" />
            <input 
              type="text" 
              placeholder="Search Member of Parliament, Constituency, District or State..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            )}
          </div>

          <select 
            className="filter-select"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="All">All States (India)</option>
            <option value="Maharashtra">Maharashtra (48 MPs)</option>
            <option value="Uttar Pradesh">Uttar Pradesh (80 MPs)</option>
            <option value="Delhi">Delhi (7 MPs)</option>
            <option value="West Bengal">West Bengal (42 MPs)</option>
            <option value="Tamil Nadu">Tamil Nadu (39 MPs)</option>
            <option value="Kerala">Kerala (20 MPs)</option>
            <option value="Gujarat">Gujarat (26 MPs)</option>
            <option value="Rajasthan">Rajasthan (25 MPs)</option>
            <option value="Uttarakhand">Uttarakhand (5 MPs)</option>
          </select>

          <button 
            className="btn-hero-action" 
            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
            onClick={() => { setSearchQuery('Nitin Gadkari'); }}
          >
            <Filter size={15} /> Quick Filter: Nagpur MP
          </button>
        </div>
      </div>

      {/* Selected MP Spotlight Banner (From Figma Frame 2) */}
      {selectedMp && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '24px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <img 
              src={selectedMp.avatar} 
              alt={selectedMp.name}
              style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #e2e8f0' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{selectedMp.name}</h3>
                <span style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                  {selectedMp.party}
                </span>
                <span className={`risk-badge ${selectedMp.riskScore > 75 ? 'critical' : selectedMp.riskScore > 35 ? 'medium' : 'low'}`}>
                  AI Risk: {selectedMp.riskScore}/100
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Constituency: <strong>{selectedMp.constituency} ({selectedMp.state})</strong> | House: <strong>{selectedMp.house}</strong> | Elected: {selectedMp.electedOn}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', borderLeft: '1px solid #e2e8f0', paddingLeft: '24px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Funds Released</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#047857' }}>
                ₹ {(selectedMp.fundsReleased / 10000000).toFixed(2)} Cr
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Allocated: ₹ {(selectedMp.allocatedLimit / 10000000).toFixed(2)} Cr</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Expenditure</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e40af' }}>
                ₹ {(selectedMp.expenditure / 10000000).toFixed(2)} Cr
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Util: {((selectedMp.expenditure / selectedMp.fundsReleased) * 100).toFixed(1)}%</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Works Recommended</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {selectedMp.worksRecommended}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Completed: {selectedMp.worksCompleted}</div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>MoSPI e-SAKSHI Verified</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '4px 10px', borderRadius: '6px' }}>
              <CheckCircle2 size={14} /> Active Dossier
            </span>
          </div>
        </div>
      )}

      {/* Main Analytics Two-Column Grid */}
      <div className="dashboard-grid" style={{ padding: 0 }}>
        
        {/* Left Column: Sector Donut Chart + MP Cards List */}
        <div>
          {/* Sector Chart Card (Frame 2.png) */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>
                <PieIcon size={18} color="#2563eb" />
                Development Work Status & Sector Distribution
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Category-wise All-India Expenditure Share
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'center' }}>
              <div style={{ height: '240px', position: 'relative' }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '30%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none'
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>100%</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>₹ 12,101 Cr</div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.6', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                  Public Purpose Guidelines:
                </strong>
                Works that serve greater public purpose are recommended for development by the MPs.
                This data shows the categories where developmental works have been sanctioned.
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1', fontSize: '0.76rem', color: '#dc2626' }}>
                  ⚠️ <strong>AI Anomaly Flag:</strong> Infrastructure sector exhibits 82% of all duplicate road paving and cost overrun incidents.
                </div>
              </div>
            </div>
          </div>

          {/* Members of Parliament Directory (Figma Frame 2) */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>
                <User size={18} color="#2563eb" />
                Members of Parliament (Constituency Drilldown)
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Showing {filteredMps.length} MPs
              </span>
            </div>

            <div className="mp-cards-grid">
              {filteredMps.map((mp) => (
                <div 
                  key={mp.id} 
                  className={`mp-card ${selectedMp?.id === mp.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMp(mp)}
                >
                  <img src={mp.avatar} alt={mp.name} className="mp-avatar" />
                  <div className="mp-info" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4>{mp.name}</h4>
                      <span className={`risk-badge ${mp.riskScore > 75 ? 'critical' : mp.riskScore > 35 ? 'medium' : 'low'}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                        {mp.riskScore}
                      </span>
                    </div>
                    <div className="mp-sub">{mp.constituency} ({mp.state})</div>
                    
                    <div className="mp-stats-row">
                      <div>
                        Allocated: <span className="mp-stat-val">₹{(mp.allocatedLimit / 10000000).toFixed(1)}Cr</span>
                      </div>
                      <div>
                        Works: <span className="mp-stat-val">{mp.worksCompleted}/{mp.worksRecommended}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Administrative Fund Hierarchy & Pipeline Breakdown (Frame 2 Slices) */}
        <div>
          
          {/* Administrative Fund Breakdown Card (CNA, SNA, NDA, IDA) */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>
                <Building size={18} color="#2563eb" />
                Administrative Fund Hierarchy
              </h3>
              <span style={{ fontSize: '0.72rem', background: '#fef08a', color: '#854d0e', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                FY 2023-24
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(ADMINISTRATIVE_FUNDS).map(([key, item]) => {
                const utilPercent = ((item.utilized / item.available) * 100).toFixed(1);
                return (
                  <div key={key} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span>{item.label}</span>
                      <span style={{ color: '#047857' }}>{utilPercent}% Utilized</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: `${utilPercent}%`, background: '#2563eb' }}></div>
                      <div style={{ width: `${100 - utilPercent}%`, background: '#f59e0b' }}></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '6px' }}>
                      <span>Utilized: ₹ {(item.utilized).toLocaleString('en-IN')} L</span>
                      <span>Avail: ₹ {(item.available).toLocaleString('en-IN')} L</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '0.75rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', background: '#2563eb', borderRadius: '2px' }}></div>
                <span>Utilized Funds</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', background: '#f59e0b', borderRadius: '2px' }}></div>
                <span>Available Balance</span>
              </div>
            </div>
          </div>

          {/* Work Status Pipeline Table (Frame 2.png Slice 4) */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>
                <Layers size={18} color="#2563eb" />
                Work Sanction Pipeline (IDA/NDA)
              </h3>
              <button 
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={() => alert('Exporting Official MoSPI MIS Table to CSV...')}
              >
                <Download size={14} /> Export CSV
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="pipeline-table">
                <thead>
                  <tr>
                    <th>Status Category</th>
                    <th style={{ textAlign: 'right' }}>Count</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {WORK_STATUS_PIPELINE.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: row.color }}></div>
                        <span style={{ fontWeight: 600 }}>{row.status}</span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{row.count.toLocaleString('en-IN')}</td>
                      <td style={{ textAlign: 'right', color: '#475569', fontSize: '0.78rem' }}>{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '16px', background: '#eff6ff', padding: '12px', borderRadius: '8px', fontSize: '0.75rem', color: '#1e40af', border: '1px solid #bfdbfe' }}>
              <strong>Reports (MIS) Quick Links:</strong>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button style={{ border: '1px solid #93c5fd', background: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.72rem', color: '#1d4ed8' }}>
                  MP Wise Fund Limit Details ↗
                </button>
                <button style={{ border: '1px solid #93c5fd', background: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.72rem', color: '#1d4ed8' }}>
                  Recommended Work Details ↗
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
