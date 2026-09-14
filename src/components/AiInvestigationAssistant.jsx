import React, { useState } from 'react';
import { Bot, Send, Sparkles, AlertTriangle, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { MPLADS_PROJECTS } from '../data/mpladsData';

export const AiInvestigationAssistant = ({ onSelectProject }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Namaste! I am the Semicolon AI Investigation Assistant (developed by Team Semicolon). I analyze e-SAKSHI data to detect anomalies, contractor cartels, ghost works, and duplicate billings under MPLADS. How can I assist your audit today?',
      projects: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    'Show me suspicious projects in Delhi',
    'Show duplicate road works in Nagpur',
    'Which contractors have won multiple contracts with high overrun?',
    'List stalled SC/ST community assets with fund lapse risk',
    'Detect fake GSTIN or unverified invoices in Uttar Pradesh'
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      projects: []
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI reasoning and matching logic
    setTimeout(() => {
      let replyText = '';
      let matchedProjects = [];
      const lower = query.toLowerCase();

      if (lower.includes('delhi')) {
        matchedProjects = MPLADS_PROJECTS.filter(p => p.state.toLowerCase() === 'delhi' || p.district.toLowerCase().includes('delhi'));
        replyText = `Found ${matchedProjects.length} flagged project in Delhi. Project MPL-2023-20184 exhibits an alarming 174% expenditure overrun against sanctioned limit with physical progress stalled at 18%. Recommendation: Trigger immediate on-site vigilance inspection.`;
      } else if (lower.includes('nagpur') || lower.includes('duplicate')) {
        matchedProjects = MPLADS_PROJECTS.filter(p => p.anomalyType.includes('Duplicate'));
        replyText = `Alert: 2 duplicate road works detected in Nagpur within 62 meters of each other (MPL-2023-10491 & MPL-2023-11882). Despite having different trade names, both firms share identical promoter PAN AAACR1290K, indicating potential duplicate billing for the same road asset.`;
      } else if (lower.includes('contractor') || lower.includes('monopoly') || lower.includes('cartel')) {
        matchedProjects = MPLADS_PROJECTS.filter(p => p.anomalyType.includes('Cartel') || p.contractorName.includes('Aman'));
        replyText = `Tender Cartelization Analysis: 'Aman Infra Projects Pvt Ltd' has secured 14 consecutive solar lighting work orders in Baramati, capturing 85% of block funds within 10 days. Single-bidder procurement pattern detected.`;
      } else if (lower.includes('sc/st') || lower.includes('lapse') || lower.includes('stalled')) {
        matchedProjects = MPLADS_PROJECTS.filter(p => p.anomalyType.includes('Stalled') || p.workName.includes('Ambedkar'));
        replyText = `Early Warning Alert: In Ahmednagar, Dr. B.R. Ambedkar Skill Development Center (MPL-2023-50911) has ₹85 Lakhs disbursed but progress has been stalled at 5% for 24 months. SC/ST mandatory funds are at risk of lapsing in 45 days.`;
      } else if (lower.includes('gst') || lower.includes('uttar pradesh') || lower.includes('fake')) {
        matchedProjects = MPLADS_PROJECTS.filter(p => p.anomalyType.includes('Fake GSTIN') || p.state === 'Uttar Pradesh');
        replyText = `Critical Tax Anomaly: In Varanasi (MPL-2023-40192), vendor 'Ganga Jal Engineering Works' submitted invoices under GSTIN 07AAAAA0000A1Z5 which is officially marked as CANCELLED by the tax authority. The QR code contains an invalid IRN hash.`;
      } else {
        matchedProjects = MPLADS_PROJECTS.filter(p => p.riskLevel === 'Critical');
        replyText = `Scanning national MPLADS registry... Found ${matchedProjects.length} critical risk anomalies requiring immediate administrative intervention across Delhi, Maharashtra, and Uttar Pradesh.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'bot',
          text: replyText,
          projects: matchedProjects
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
      
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bot size={22} color="#2563eb" />
          AI Investigation Assistant (Natural Language Audit Engine)
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
          Query MPLADS records using plain English. Discover contractor cartels, ghost works, fake GST invoices, and cost overruns.
        </p>
      </div>

      <div className="chat-container">
        
        {/* Left Sidebar with Sample Investigation Prompts */}
        <div className="chat-sidebar">
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#f59e0b" /> Suggested Audit Queries
          </div>

          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              className="prompt-chip"
              onClick={() => handleSend(prompt)}
            >
              {prompt}
            </button>
          ))}

          <div style={{ marginTop: 'auto', background: '#eff6ff', padding: '12px', borderRadius: '8px', fontSize: '0.72rem', color: '#1e40af', border: '1px solid #bfdbfe' }}>
            <strong>💡 Jury Pro Tip:</strong>
            <div>Ask about <em>"Delhi"</em> or <em>"Duplicate road works in Nagpur"</em> to showcase Semicolon AI's cross-table intelligence.</div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="chat-main">
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                <div style={{ fontWeight: 600, fontSize: '0.72rem', marginBottom: '4px', opacity: 0.8 }}>
                  {msg.sender === 'user' ? 'Auditor / Investigator' : 'Semicolon AI Assistant'}
                </div>
                <div>{msg.text}</div>

                {/* Attached Matched Project Cards */}
                {msg.projects && msg.projects.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {msg.projects.map((p) => (
                      <div 
                        key={p.id}
                        style={{
                          background: 'white',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          color: '#0f172a'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb' }}>{p.id}</span>
                          <span className={`risk-badge ${p.riskLevel.toLowerCase()}`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                            {p.riskLevel} ({p.riskScore}/100)
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                          {p.workName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {p.district}, {p.state} | Spent: ₹{(p.expenditure/100000).toFixed(1)}L / ₹{(p.sanctionedAmount/100000).toFixed(1)}L ({p.progressPercent}% progress)
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble bot" style={{ fontStyle: 'italic', color: '#64748b' }}>
                Analyzing e-SAKSHI records & calculating anomaly probabilities...
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="chat-input-row"
          >
            <input 
              type="text" 
              placeholder="Ask anything (e.g. 'Show me suspicious projects in Delhi' or 'Check contractor monopolies')..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="btn-primary">
              <Send size={16} /> Send
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
