import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Users, MonitorSpeaker, Clock, ArrowRight, Play, Inbox, 
  Key, X, Sparkles, AlertCircle, TrendingUp, Copy, ExternalLink, Zap, Layers, Activity, ShieldCheck
} from 'lucide-react';
import { ThemeContext } from '../App';
import { apiBaseUrl } from '../config';
import Navbar from '../components/Navbar';
import CommandPalette from '../components/CommandPalette';
import './Dashboard.css';

const TEMPLATES = [
  {
    id: 'kanban',
    title: 'Agile Sprint Board',
    category: 'Productivity',
    desc: '3-stage Kanban pipeline with backlog, in-progress & review stickies.',
    icon: '📋',
    color: '#3b82f6',
    routeParam: 'kanban'
  },
  {
    id: 'flowchart',
    title: 'System Architecture',
    category: 'Engineering',
    desc: 'Microservices flow with API Gateway, Auth, & Redis cache vectors.',
    icon: '⚡',
    color: '#8b5cf6',
    routeParam: 'architecture'
  },
  {
    id: 'swot',
    title: 'SWOT Strategy Matrix',
    category: 'Strategy',
    desc: '4-quadrant strategic workspace for strengths, risks & opportunities.',
    icon: '📊',
    color: '#10b981',
    routeParam: 'swot'
  },
  {
    id: 'brainstorm',
    title: 'Ideation Cluster',
    category: 'Design & Brainstorm',
    desc: 'Color-coded dynamic sticky cluster for high-velocity team ideation.',
    icon: '💡',
    color: '#ec4899',
    routeParam: 'cluster'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext) || { theme: 'dark' };
  
  const [recentRooms, setRecentRooms] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [userName, setUserName] = useState('Collaborator');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Modal & Toast states
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [joinModalError, setJoinModalError] = useState('');
  const [isVerifyingRoom, setIsVerifyingRoom] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? '' : prev);
    }, 3500);
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (savedUser?.name) {
      setUserName(savedUser.name);
    }
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dashRes, histRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/dashboard`),
          fetch(`${apiBaseUrl}/api/history`)
        ]);
        
        const dashData = await dashRes.json();
        const histData = await histRes.json();
        
        setRecentRooms(dashData.recentRooms || []);
        setHistory(histData.sessions ? histData.sessions.slice(0, 4) : []);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const createRoom = async (title = 'New Brainstorm Session', templateParam = '') => {
    if (isCreatingRoom) return;

    setIsCreatingRoom(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });

      const data = await response.json();
      if (data.success) {
        const url = templateParam ? `/room/${data.roomId}?template=${templateParam}` : `/room/${data.roomId}`;
        navigate(url);
      } else {
        showToast(`Could not create room: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Failed to create room", err);
      showToast('Could not create room. Please make sure backend is running on port 3001.');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const openJoinModal = () => {
    setShowJoinModal(true);
    setJoinModalError('');
    setJoinRoomCode('');
  };

  const handleJoinModalSubmit = async (e) => {
    if (e) e.preventDefault();
    const code = joinRoomCode.trim().toUpperCase();
    if (!code) {
      setJoinModalError('Please enter a 6-character room code');
      return;
    }
    setIsVerifyingRoom(true);
    setJoinModalError('');
    try {
      const res = await fetch(`${apiBaseUrl}/api/room/${code}`);
      if (!res.ok) {
        setJoinModalError('Room not found. Please check the code and try again.');
        setIsVerifyingRoom(false);
        return;
      }
      setShowJoinModal(false);
      navigate(`/room/${code}`);
    } catch {
      setJoinModalError('Could not connect to server. Please check backend.');
      setIsVerifyingRoom(false);
    }
  };

  const copyRoomCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/room/${code}`);
    showToast(`🔗 Copied room link: ${code}`);
  };

  return (
    <div className="dashboard-container">
      {/* Top Enterprise Navbar */}
      <Navbar 
        onOpenSearch={() => setIsSearchOpen(true)}
        onNewRoom={() => createRoom()}
      />

      {/* Global ⌘K Command Palette */}
      <CommandPalette 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenJoinModal={openJoinModal}
        onNewRoom={() => createRoom()}
      />

      {/* Animated Toast Notification */}
      {toastMessage && (
        <div className="dashboard-toast" role="status">
          <Sparkles size={16} className="text-gradient" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Glassmorphic Join Room Modal */}
      {showJoinModal && (
        <div className="join-modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="join-modal glass-card" onClick={e => e.stopPropagation()}>
            <div className="join-modal-header">
              <div className="flex-align" style={{ gap: '0.6rem' }}>
                <Key size={20} className="text-gradient" />
                <h3>Join Collaboration Room</h3>
              </div>
              <button 
                type="button" 
                className="icon-btn-sm" 
                onClick={() => setShowJoinModal(false)}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>
            
            <p className="text-secondary text-sm" style={{ marginBottom: '1.25rem' }}>
              Enter the unique 6-character room code shared by your team.
            </p>

            <form onSubmit={handleJoinModalSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  className="input-glass join-modal-input"
                  placeholder="e.g. 60JAZK"
                  value={joinRoomCode}
                  maxLength={10}
                  autoFocus
                  onChange={e => {
                    setJoinRoomCode(e.target.value.toUpperCase());
                    setJoinModalError('');
                  }}
                />
                {joinModalError && (
                  <div className="join-modal-error">
                    <AlertCircle size={14} />
                    <span>{joinModalError}</span>
                  </div>
                )}
              </div>

              <div className="join-modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowJoinModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={isVerifyingRoom || !joinRoomCode.trim()}
                >
                  {isVerifyingRoom ? 'Connecting...' : 'Join Space'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Cockpit Content */}
      <main className="dashboard-main">
        {/* Welcome Header */}
        <header className="page-header flex-center-between">
          <div>
            <div className="welcome-badge">
              <span className="pulse-dot"></span>
              <span>LIVECOLLAB MINDSPACE • COMMAND COCKPIT</span>
            </div>
            <h1>Welcome back, {userName}</h1>
            <p className="text-secondary">Orchestrate real-time whiteboard spaces, deploy agile templates, and co-create with Agentic AI.</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn-secondary flex-center" 
              onClick={openJoinModal}
            >
              <Key size={17} style={{ marginRight: '0.4rem' }} />
              <span>Join Room</span>
            </button>
            <button 
              className="btn-primary flex-center" 
              onClick={() => createRoom()} 
              disabled={isCreatingRoom}
            >
              <Plus size={18} style={{ marginRight: '0.4rem' }} /> 
              <span>{isCreatingRoom ? 'Creating...' : 'New Room'}</span>
            </button>
          </div>
        </header>

        {/* Enterprise KPI Metrics Ribbon */}
        <section className="kpi-grid">
          <div className="kpi-card glass-card">
            <div className="kpi-header">
              <span className="kpi-title">Active Workspaces</span>
              <div className="kpi-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.12)' }}>
                <MonitorSpeaker size={18} color="#6366f1" />
              </div>
            </div>
            <div className="kpi-metric-wrap">
              <span className="kpi-metric">{recentRooms.length || 2}</span>
              <span className="kpi-trend positive flex-align"><TrendingUp size={12} /> +18%</span>
            </div>
            <span className="kpi-caption">Real-time collaborative sessions</span>
          </div>

          <div className="kpi-card glass-card">
            <div className="kpi-header">
              <span className="kpi-title">Active Peers</span>
              <div className="kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>
                <Users size={18} color="#10b981" />
              </div>
            </div>
            <div className="kpi-metric-wrap">
              <span className="kpi-metric">8 Peers</span>
              <span className="kpi-trend positive flex-align"><Activity size={12} /> Online</span>
            </div>
            <span className="kpi-caption">Multiplayer cursor & video sync</span>
          </div>

          <div className="kpi-card glass-card">
            <div className="kpi-header">
              <span className="kpi-title">AI Summaries</span>
              <div className="kpi-icon-wrap" style={{ background: 'rgba(217, 70, 239, 0.12)' }}>
                <Sparkles size={18} color="#d946ef" />
              </div>
            </div>
            <div className="kpi-metric-wrap">
              <span className="kpi-metric">14 Saved</span>
              <span className="kpi-trend positive flex-align"><TrendingUp size={12} /> +34%</span>
            </div>
            <span className="kpi-caption">Autonomous executive minutes</span>
          </div>

          <div className="kpi-card glass-card">
            <div className="kpi-header">
              <span className="kpi-title">System Sync SLA</span>
              <div className="kpi-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.12)' }}>
                <ShieldCheck size={18} color="#06b6d4" />
              </div>
            </div>
            <div className="kpi-metric-wrap">
              <span className="kpi-metric">99.99%</span>
              <span className="kpi-trend positive flex-align">&lt; 15ms</span>
            </div>
            <span className="kpi-caption">Zero-lag WebSockets pipeline</span>
          </div>
        </section>

        {/* 1-Click Interactive Template Launchers */}
        <section className="section">
          <div className="section-header">
            <div>
              <h2>Template Studio</h2>
              <p className="text-secondary text-sm">Spin up pre-architected boards instantly.</p>
            </div>
          </div>
          
          <div className="template-grid">
            {TEMPLATES.map(tpl => (
              <div 
                key={tpl.id} 
                className="template-card glass-card"
                onClick={() => createRoom(tpl.title, tpl.routeParam)}
              >
                <div className="template-card-top">
                  <div className="template-icon-circle" style={{ background: `${tpl.color}20`, color: tpl.color }}>
                    <span style={{ fontSize: '1.3rem' }}>{tpl.icon}</span>
                  </div>
                  <span className="template-category-badge">{tpl.category}</span>
                </div>
                
                <h3 className="template-title">{tpl.title}</h3>
                <p className="template-desc">{tpl.desc}</p>
                
                <div className="template-action-btn">
                  <span>Launch Template</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Collaboration Rooms */}
        <section className="section">
          <div className="section-header">
            <div>
              <h2>Active Workspaces</h2>
              <p className="text-secondary text-sm">Open collaborative sessions with your engineering and design peers.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p className="text-secondary">Syncing active workspace topology...</p>
            </div>
          ) : recentRooms.length === 0 ? (
            <div className="empty-state glass-panel">
              <Inbox size={42} className="text-secondary mb-3" />
              <h3>No active rooms yet</h3>
              <p className="text-secondary text-sm mb-4">Create your first collaborative canvas or join an existing team space.</p>
              <button className="btn-primary" onClick={() => createRoom()}>
                <Plus size={16} style={{ marginRight: '0.3rem' }} /> Create Room
              </button>
            </div>
          ) : (
            <div className="rooms-grid">
              {recentRooms.map((room) => (
                <div 
                  key={room.id} 
                  className="room-card glass-card"
                  onClick={() => navigate(`/room/${room.id}`)}
                >
                  <div className="room-card-header">
                    <span className="room-code-tag">{room.id}</span>
                    <button 
                      className="room-copy-btn" 
                      onClick={(e) => copyRoomCode(room.id, e)}
                      title="Copy room link"
                    >
                      <Copy size={13} />
                    </button>
                  </div>

                  <h3 className="room-title">{room.title || 'Collaborative Whiteboard'}</h3>
                  
                  <div className="room-card-footer">
                    <div className="room-participants">
                      <Users size={14} className="text-secondary" />
                      <span>{room.participants || 1} online</span>
                    </div>
                    <span className="room-active-time">{room.lastActive || 'Active now'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Session History */}
        {history.length > 0 && (
          <section className="section">
            <div className="section-header">
              <div>
                <h2>Recent Session Vault</h2>
                <p className="text-secondary text-sm">Review previous collaborations, notes, and AI executive summaries.</p>
              </div>
              <button className="btn-secondary btn-sm" onClick={() => navigate('/history')}>
                View All <ArrowRight size={14} style={{ marginLeft: '0.3rem' }} />
              </button>
            </div>

            <div className="history-preview-list">
              {history.map(sess => (
                <div 
                  key={sess.id} 
                  className="history-preview-item glass-card"
                  onClick={() => navigate(`/room/${sess.roomId}`)}
                >
                  <div className="history-item-left">
                    <div className="history-icon-circle">
                      <Layers size={16} className="text-gradient" />
                    </div>
                    <div>
                      <h4 className="history-item-title">{sess.title || 'Team Session'}</h4>
                      <p className="history-item-meta text-secondary text-xs">
                        {sess.date ? new Date(sess.date).toLocaleDateString() : 'Recent'} • {sess.roomId}
                      </p>
                    </div>
                  </div>
                  <div className="history-item-right">
                    <span className="badge badge-primary">{sess.duration || '35m'}</span>
                    <ArrowRight size={14} className="text-secondary" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
