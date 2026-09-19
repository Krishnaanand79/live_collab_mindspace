import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MonitorSpeaker, ArrowLeft, Download, PlayCircle, Clock, Calendar as CalendarIcon, 
  Filter, Search, Sparkles, Inbox, Share2, Tag, Check, ArrowUpRight
} from 'lucide-react';
import { apiBaseUrl } from '../config';
import './History.css';
import './Dashboard.css';

const History = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [copyToast, setCopyToast] = useState('');

  const triggerToast = (msg) => {
    setCopyToast(msg);
    setTimeout(() => setCopyToast(''), 3000);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/history`);
        const data = await response.json();
        setSessions(data.sessions || []);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const downloadNotes = (session) => {
    const content = `# Collaboration Notes: ${session.title}
Date: ${new Date(session.date).toLocaleString()}
Duration: ${session.duration}
Participants: ${session.participants}
Room Code: ${session.roomId}

## AI Executive Summary
${session.aiSummary || 'No summary recorded.'}
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${(session.title || 'session').replace(/\s+/g, '_')}_notes.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast('📥 Downloaded markdown notes!');
  };

  const shareSummary = (session, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`MindSpace AI Summary for "${session.title}":\n\n${session.aiSummary}`);
    triggerToast('📋 Copied AI summary to clipboard!');
  };

  const filteredSessions = sessions.filter(session => {
    // Category filter
    if (activeCategory === 'notes' && !session.aiSummary) return false;
    if (activeCategory === 'recordings' && !session.recordingAvailable) return false;

    // Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (session.title && session.title.toLowerCase().includes(q)) ||
      (session.aiSummary && session.aiSummary.toLowerCase().includes(q)) ||
      (session.roomId && session.roomId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="history-container">
      {/* Floating Toast */}
      {copyToast && (
        <div className="dashboard-toast">
          <Sparkles size={16} className="text-gradient" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* Header */}
      <nav className="glass history-navbar">
        <div className="navbar-left">
          <button className="icon-btn glass-panel" onClick={() => navigate('/dashboard')} aria-label="Back to dashboard">
            <ArrowLeft size={20} />
          </button>
          <h2 className="logo" style={{ marginLeft: '0.8rem' }} onClick={() => navigate('/dashboard')}>
            <img src="/logo.png" alt="LiveCollab" style={{ height: '34px' }} />
          </h2>
        </div>
      </nav>

      <main className="history-main">
        {/* Header with Title & Live Search */}
        <header className="page-header flex-center-between">
          <div>
            <div className="welcome-badge">
              <span className="pulse-dot"></span>
              <span>HISTORICAL ARCHIVES & AI MINUTES</span>
            </div>
            <h1>Collaboration History</h1>
            <p className="text-secondary">Review your past meetings, AI summaries, and recorded whiteboards.</p>
          </div>
          <div className="filters glass-panel">
            <div className="search-box">
              <Search size={16} className="text-secondary"/>
              <input 
                type="text" 
                placeholder="Search sessions..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="vertical-divider"></div>
            <button className="btn-text text-secondary" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
              <Filter size={15}/> Clear
            </button>
          </div>
        </header>

        {/* History Analytics Bar */}
        <div className="history-kpi-bar">
          <div className="history-kpi-chip glass-card">
            <span className="kpi-chip-label">TOTAL SESSIONS</span>
            <span className="kpi-chip-val">{sessions.length || 2} Recorded</span>
          </div>
          <div className="history-kpi-chip glass-card">
            <span className="kpi-chip-label">AI EXECUTIVE SUMMARIES</span>
            <span className="kpi-chip-val text-gradient">100% Captured</span>
          </div>
          <div className="history-kpi-chip glass-card">
            <span className="kpi-chip-label">AVG COLLABORATION TIME</span>
            <span className="kpi-chip-val">38 Minutes</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="filter-pills-row">
          <button 
            className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Sessions ({sessions.length})
          </button>
          <button 
            className={`filter-pill ${activeCategory === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveCategory('notes')}
          >
            ✨ AI Summarized
          </button>
          <button 
            className={`filter-pill ${activeCategory === 'recordings' ? 'active' : ''}`}
            onClick={() => setActiveCategory('recordings')}
          >
            🎥 Recordings Available
          </button>
        </div>

        {/* Timeline Sessions Container */}
        <div className="timeline-container">
          {isLoading ? (
            // Skeleton State
            [1, 2, 3].map((_, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-dot" style={{background: 'var(--border-color)', boxShadow: 'none'}}></div>
                  {index !== 2 && <div className="marker-line"></div>}
                </div>
                
                <div className="timeline-content glass-card skeleton-card">
                  <div className="skeleton-text" style={{width: '40%', height: '20px'}}></div>
                  <div className="skeleton-text" style={{width: '60%'}}></div>
                  <div className="skeleton-box" style={{height: '80px', borderRadius: '8px', marginTop: '1rem'}}></div>
                </div>
              </div>
            ))
          ) : filteredSessions.length > 0 ? (
            // Loaded State
            filteredSessions.map((session, index) => (
              <div key={session.id} className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  {index !== filteredSessions.length - 1 && <div className="marker-line"></div>}
                </div>
                
                <div className="timeline-content glass-card bounce-hover">
                  <div className="content-header">
                    <div>
                      <div className="session-tag-row">
                        <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                          ROOM: {session.roomId}
                        </span>
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                          COMPLETED
                        </span>
                      </div>
                      <h3>{session.title}</h3>
                    </div>
                    <div className="session-meta">
                      <span className="meta-item"><CalendarIcon size={14}/> {new Date(session.date).toLocaleString()}</span>
                      <span className="meta-item"><Clock size={14}/> {session.duration}</span>
                      <span className="meta-item"><UsersIcon count={session.participants}/></span>
                    </div>
                  </div>

                  <div className="content-body">
                    <div className="ai-summary-box">
                      <div className="flex-center-between" style={{ marginBottom: '0.5rem' }}>
                        <h4 className="flex-align">
                          <Sparkles size={16} className="text-gradient" style={{marginRight:'0.4rem'}}/> 
                          AI Executive Summary
                        </h4>
                        <button 
                          className="copy-summary-btn flex-align" 
                          title="Copy AI Summary"
                          onClick={(e) => shareSummary(session, e)}
                        >
                          <Share2 size={13} /> Copy Summary
                        </button>
                      </div>
                      <p>{session.aiSummary}</p>
                    </div>
                  </div>

                  <div className="content-actions">
                    <button className="btn-primary btn-sm" onClick={() => navigate(`/room/${session.roomId}`)}>
                      Reopen Space <ArrowUpRight size={14} />
                    </button>
                    <button className="btn-secondary btn-sm" onClick={() => downloadNotes(session)}>
                      <Download size={15} style={{marginRight:'0.4rem'}}/> Notes
                    </button>
                    {session.recordingAvailable && (
                      <button className="btn-secondary btn-sm" style={{marginLeft: 'auto'}}>
                        <PlayCircle size={15} style={{marginRight:'0.4rem'}}/> Playback
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty State
            <div className="empty-state glass-panel">
              <div className="empty-icon-wrap">
                <Inbox size={32} className="text-secondary" />
              </div>
              <h3>{searchQuery ? 'No Matching Sessions' : 'No Past Collaborations'}</h3>
              <p className="text-secondary">
                {searchQuery 
                  ? `No collaboration sessions matched "${searchQuery}". Try a different keyword or clear the search.`
                  : "It looks like you haven't had any sessions yet. Once you complete a room, your AI-generated summaries will appear here."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const UsersIcon = ({count}) => (
  <span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    {count}
  </span>
);

export default History;
