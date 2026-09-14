import React, { useState } from 'react';
import { 
  Smartphone, 
  MapPin, 
  Camera, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  ShieldCheck, 
  FileCheck, 
  RefreshCw, 
  Clock, 
  Building 
} from 'lucide-react';
import { MPLADS_PROJECTS } from '../data/mpladsData';

export const FieldVerificationPortal = ({ onVerificationComplete }) => {
  const [selectedCase, setSelectedCase] = useState(MPLADS_PROJECTS[4]); // Varanasi Tube Wells or Nagpur
  const [currentStep, setCurrentStep] = useState(1);
  
  // Verification states
  const [gpsVerified, setGpsVerified] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [qrScanned, setQrScanned] = useState(false);
  const [qrDetails, setQrDetails] = useState(null);
  const [verifierNotes, setVerifierNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Simulate GPS check
  const handleVerifyGps = () => {
    setTimeout(() => {
      setGpsVerified(true);
    }, 600);
  };

  // Simulate Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCapturedPhoto(url);
    } else {
      // Default sample photo
      setCapturedPhoto('https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=600&auto=format&fit=crop&q=80');
    }
  };

  // Simulate GST QR Code Scan
  const handleScanQr = () => {
    setTimeout(() => {
      setQrScanned(true);
      if (selectedCase.id === 'MPL-2023-40192') {
        // Fake GST case
        setQrDetails({
          gstin: '07AAAAA0000A1Z5',
          supplier: 'Ganga Jal Engineering Works',
          invoiceNo: 'GJEW/2023/41',
          irn: 'INVALID_IRN_CHECKSUM_FAILURE_1092834',
          invoiceDate: '14-Aug-2023',
          amount: '₹ 28,00,000.00',
          status: 'FLAGGED_CANCELLED_GSTIN',
          isValid: false,
          remarks: 'CRITICAL WARNING: GSTIN status is officially CANCELLED by CBIC. IRN signature does not match National NIC registry.'
        });
      } else {
        // Normal / Duplicate check
        setQrDetails({
          gstin: selectedCase.contractorGstin,
          supplier: selectedCase.contractorName,
          invoiceNo: selectedCase.gstInvoice.invoiceNo,
          irn: selectedCase.gstInvoice.irn,
          invoiceDate: '12-Apr-2023',
          amount: `₹ ${(selectedCase.expenditure / 100000).toFixed(2)} Lakhs`,
          status: 'VERIFIED_ACTIVE',
          isValid: true,
          remarks: 'GSTIN active in GST System. e-Invoice IRN verified with GST Portal.'
        });
      }
    }, 800);
  };

  const handleSubmitVerification = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
      if (onVerificationComplete) {
        onVerificationComplete(selectedCase.id);
      }
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
      
      {/* Header */}
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
            <Smartphone size={22} color="#7c3aed" />
            Field Verifier Portal & GST Invoice QR Verification
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
            Official on-site audit module for District Field Inspectors. Enforces GPS Geofencing, Live Photos, and e-Invoice QR Code validation.
          </p>
        </div>

        <span style={{ fontSize: '0.78rem', background: '#f5f3ff', color: '#6d28d9', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, border: '1px solid #ddd6fe' }}>
          Inspector ID: VER-MH-4019
        </span>
      </div>

      {/* Stepper Navigation */}
      <div className="verification-card" style={{ marginBottom: '24px' }}>
        <div className="stepper">
          <div className={`step-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-circle">{currentStep > 1 ? '✓' : '1'}</div>
            <div className="step-label">Select Case</div>
          </div>
          <div className={`step-item ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-circle">{currentStep > 2 ? '✓' : '2'}</div>
            <div className="step-label">GPS Geofence</div>
          </div>
          <div className={`step-item ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="step-circle">{currentStep > 3 ? '✓' : '3'}</div>
            <div className="step-label">Photo Evidence</div>
          </div>
          <div className={`step-item ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
            <div className="step-circle">{currentStep > 4 ? '✓' : '4'}</div>
            <div className="step-label">GST QR Scan</div>
          </div>
          <div className={`step-item ${currentStep >= 5 ? 'active' : ''}`}>
            <div className="step-circle">5</div>
            <div className="step-label">Audit Decision</div>
          </div>
        </div>

        {/* STEP 1: Case Selection */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '12px' }}>Assigned Cases Requiring Physical Verification</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
              Select a work order flagged by the AI Anomaly Detection Engine to commence verification:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {MPLADS_PROJECTS.filter(p => p.riskLevel === 'Critical' || p.riskLevel === 'High').map((proj) => (
                <div 
                  key={proj.id}
                  onClick={() => setSelectedCase(proj)}
                  style={{
                    border: selectedCase?.id === proj.id ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                    background: selectedCase?.id === proj.id ? '#faf5ff' : 'white',
                    borderRadius: '8px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563eb' }}>{proj.id}</span>
                      <span className={`risk-badge ${proj.riskLevel.toLowerCase()}`}>
                        {proj.riskLevel} ({proj.riskScore}/100)
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '2px' }}>
                      {proj.workName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {proj.district}, {proj.state} | MP: {proj.mpName} | Sanction: ₹{(proj.sanctionedAmount/100000).toFixed(1)}L
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 700 }}>
                      ⚠️ {proj.anomalyType}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => setCurrentStep(2)}>
                Proceed to GPS Geofence Check →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GPS Geofence */}
        {currentStep === 2 && (
          <div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '12px' }}>Location Verification (GPS Geofencing)</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
              Target Coordinates: <strong>{selectedCase.lat}° N, {selectedCase.lng}° E</strong> ({selectedCase.district}, {selectedCase.state})
            </p>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <MapPin size={48} color={gpsVerified ? '#10b981' : '#64748b'} style={{ margin: '0 auto 12px' }} />
              
              {gpsVerified ? (
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#047857', marginBottom: '4px' }}>
                    GPS Geofence Match Verified! (14 meters from asset)
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#475569' }}>
                    Device coordinates: {selectedCase.lat + 0.0001}° N, {selectedCase.lng + 0.0001}° E. Anti-spoofing integrity checked.
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    Audit device is standing at project site
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
                    Click below to query device GNSS coordinates against sanctioned project bounds.
                  </p>
                  <button className="btn-primary" style={{ margin: '0 auto' }} onClick={handleVerifyGps}>
                    <MapPin size={16} /> Verify Current Device GPS
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-hero-action" onClick={() => setCurrentStep(1)}>← Back</button>
              <button 
                className="btn-primary" 
                disabled={!gpsVerified}
                style={{ opacity: gpsVerified ? 1 : 0.5, cursor: gpsVerified ? 'pointer' : 'not-allowed' }}
                onClick={() => setCurrentStep(3)}
              >
                Proceed to Photo Capture →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Photo Capture */}
        {currentStep === 3 && (
          <div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '12px' }}>Physical Verification (Photo Evidence Capture)</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
              Capture or upload on-site photographic proof of the physical asset (e.g. road patch, tube well, community hall).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '32px 20px', textAlign: 'center', background: '#f8fafc' }}>
                <Camera size={40} color="#7c3aed" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px' }}>Upload On-Site Photo</div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '16px' }}>
                  EXIF geolocation & timestamp will be auto-embedded into the audit report.
                </p>
                <input 
                  type="file" 
                  accept="image/*" 
                  id="photo-upload" 
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />
                <label 
                  htmlFor="photo-upload" 
                  className="btn-primary" 
                  style={{ display: 'inline-flex', cursor: 'pointer', margin: '0 auto' }}
                >
                  <Upload size={14} /> Choose File / Capture
                </label>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#0f172a', position: 'relative', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {capturedPhoto ? (
                  <>
                    <img src={capturedPhoto} alt="Audit Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', color: 'white', padding: '6px 10px', borderRadius: '6px', fontSize: '0.7rem', backdropFilter: 'blur(4px)' }}>
                      <div>📍 Geo-tag: {selectedCase.lat}° N, {selectedCase.lng}° E</div>
                      <div>🕒 Timestamp: {new Date().toLocaleDateString('en-IN')} {new Date().toLocaleTimeString('en-IN')}</div>
                    </div>
                  </>
                ) : (
                  <div style={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', padding: '20px' }}>
                    Preview of captured audit photo with cryptographic watermark will appear here.
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-hero-action" onClick={() => setCurrentStep(2)}>← Back</button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  if (!capturedPhoto) {
                    setCapturedPhoto('https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=600&auto=format&fit=crop&q=80');
                  }
                  setCurrentStep(4);
                }}
              >
                Proceed to GST Invoice Scan →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: GST QR Verification */}
        {currentStep === 4 && (
          <div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '12px' }}>GST Invoice QR Verification (Anti-Fraud Check)</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
              Scan the B2B e-Invoice QR code presented by contractor <strong>{selectedCase.contractorName}</strong>:
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
              {!qrScanned ? (
                <div style={{ textAlign: 'center' }}>
                  <QrCode size={56} color="#2563eb" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Scan Contractor Invoice QR Code</div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '420px', margin: '0 auto 16px' }}>
                    Queries the GST e-Invoice System (NIC) in real-time to validate the 64-character IRN and vendor active status.
                  </p>
                  <button className="btn-primary" style={{ margin: '0 auto' }} onClick={handleScanQr}>
                    <QrCode size={16} /> Scan & Validate Demo Invoice QR
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {qrDetails.isValid ? (
                        <CheckCircle2 size={24} color="#10b981" />
                      ) : (
                        <AlertTriangle size={24} color="#ef4444" />
                      )}
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: qrDetails.isValid ? '#047857' : '#991b1b' }}>
                          {qrDetails.isValid ? 'GST System Verification PASSED' : 'TAX FRAUD DETECTED: CANCELLED GSTIN'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Verified against GSTN e-Invoice Registry
                        </div>
                      </div>
                    </div>

                    <span className={`risk-badge ${qrDetails.isValid ? 'low' : 'critical'}`}>
                      {qrDetails.status}
                    </span>
                  </div>

                  <div style={{
                    background: qrDetails.isValid ? '#f0fdf4' : '#fef2f2',
                    border: qrDetails.isValid ? '1px solid #bbf7d0' : '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '16px',
                    fontSize: '0.82rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                  }}>
                    <div><strong>Contractor / Supplier:</strong> {qrDetails.supplier}</div>
                    <div><strong>GSTIN:</strong> <code>{qrDetails.gstin}</code></div>
                    <div><strong>Invoice No:</strong> {qrDetails.invoiceNo}</div>
                    <div><strong>Invoice Amount:</strong> {qrDetails.amount}</div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <strong>IRN Hash:</strong> <span style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>{qrDetails.irn}</span>
                    </div>
                    <div style={{ gridColumn: 'span 2', color: qrDetails.isValid ? '#15803d' : '#b91c1c', fontWeight: 700 }}>
                      {qrDetails.remarks}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-hero-action" onClick={() => setCurrentStep(3)}>← Back</button>
              <button 
                className="btn-primary" 
                disabled={!qrScanned}
                style={{ opacity: qrScanned ? 1 : 0.5, cursor: qrScanned ? 'pointer' : 'not-allowed' }}
                onClick={() => setCurrentStep(5)}
              >
                Proceed to Final Audit Decision →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Submit Decision */}
        {currentStep === 5 && (
          <div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '12px' }}>Final On-Site Verification Submission</h3>
            
            {isComplete ? (
              <div style={{ textAlign: 'center', padding: '32px 20px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ color: '#047857', marginBottom: '6px' }}>Verification Successfully Submitted!</h3>
                <p style={{ fontSize: '0.86rem', color: '#166534', maxWidth: '520px', margin: '0 auto 20px' }}>
                  Audit report for <strong>{selectedCase.id}</strong> has been logged to the e-SAKSHI intelligence blockchain ledger. The project risk score has been dynamically updated and an automated notification sent to the District Collector.
                </p>
                <button className="btn-primary" style={{ margin: '0 auto' }} onClick={() => { setIsComplete(false); setCurrentStep(1); }}>
                  Verify Another Case
                </button>
              </div>
            ) : (
              <div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px', fontSize: '0.84rem' }}>
                  <div style={{ marginBottom: '8px' }}><strong>Audited Case:</strong> {selectedCase.workName} ({selectedCase.id})</div>
                  <div style={{ marginBottom: '8px' }}><strong>GPS Verification:</strong> <span style={{ color: '#16a34a' }}>✅ Geofence Verified</span></div>
                  <div style={{ marginBottom: '8px' }}><strong>Photo Proof:</strong> <span style={{ color: '#16a34a' }}>✅ EXIF Watermark Verified</span></div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>GST Compliance:</strong> {qrDetails?.isValid ? (
                      <span style={{ color: '#16a34a' }}>✅ Valid e-Invoice</span>
                    ) : (
                      <span style={{ color: '#dc2626' }}>❌ Failed (Fraudulent/Cancelled GSTIN)</span>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Inspector Field Findings & Remarks:
                  </label>
                  <textarea
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.86rem',
                      outline: 'none'
                    }}
                    placeholder="Document ground observations (e.g. discrepancy in installed units, substandard aggregate materials, or unauthorized alterations)..."
                    value={verifierNotes}
                    onChange={(e) => setVerifierNotes(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button className="btn-hero-action" onClick={() => setCurrentStep(4)}>← Back</button>
                  <button 
                    className="btn-primary"
                    style={{ background: '#047857' }}
                    onClick={handleSubmitVerification}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting to e-SAKSHI...' : 'Submit Official Audit Dossier ✓'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
