import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Users, MonitorSpeaker, Clock, ArrowRight, Play, Sun, Moon, Inbox, 
  Key, X, Sparkles, AlertCircle, Bell, ChevronDown, Check, TrendingUp, Cpu, 
  Layout, Copy, ExternalLink, Zap, Layers, Activity, ShieldCheck
} from 'lucide-react';
import { ThemeContext } from '../App';
import { apiBaseUrl } from '../config';
import './Dashboard.css';

const TEMPLATES = [
  {
    id: 'kanban',
    title: 'Agile Sprint Board',
    category: 'Productivity',
    desc: '3-stage Kanban pipeline with backlog, in-progress & review stickies.',
    icon: '📋',
    color: '#3b82f6'
  },
  {
    id: 'flowchart',
    title: 'System Architecture',
    category: 'Engineering',
    desc: 'Microservices flow with API Gateway, Auth, & Redis cache vectors.',
    icon: '⚡',
    color: '#8b5cf6'
  },
  {
    id: 'swot',
    title: 'SWOT Strategy Matrix',
    category: 'Strategy',
    desc: '4-quadrant strategic workspace for strengths, risks & opportunities.',
    icon: '📊',
    color: '#10b981'
  },
  {
    id: 'brainstorm',
    title: 'Ideation Cluster',
    category: 'Design & Brainstorm',
    desc: 'Color-coded dynamic sticky cluster for high-velocity team ideation.',
    icon: '💡',
    color: '#ec4899'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [recentRooms, setRecentRooms] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState('Personal Workspace');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [userName, setUserName] = useState('Collaborator');

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

  const createRoom = async (title = 'New Brainstorm Session') => {
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
        navigate(`/room/${data.roomId}`);
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

  // Filtered rooms based on search query
  const filteredRooms = recentRooms.filter(room => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      room.title?.toLowerCase().includes(q) ||
      room.id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="dashboard-container">
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

      {/* Top Navbar */}
      <nav className="glass navbar">
        <div className="navbar-left">
          <h2 className="logo" onClick={() => navigate('/dashboard')}>
            <img src="/logo.png" alt="LiveCollab" style={{ height: '34px' }} />
          </h2>

          {/* Workspace Selector Dropdown */}
          <div className="workspace-selector-wrap">
            <button 
              className="workspace-selector-btn"
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            >
              <span className="workspace-icon">⚡</span>
              <span className="workspace-name">{currentWorkspace}</span>
              <ChevronDown size={14} className="text-secondary" />
            </button>

            {showWorkspaceMenu && (
              <div className="workspace-dropdown glass-card">
                <div 
                  className={`workspace-item ${currentWorkspace === 'Personal Workspace' ? 'selected' : ''}`}
                  onClick={() => { setCurrentWorkspace('Personal Workspace'); setShowWorkspaceMenu(false); }}
                >
                  <span>⚡ Personal Workspace</span>
                  {currentWorkspace === 'Personal Workspace' && <Check size={14} className="text-gradient" />}
                </div>
                <div 
                  className={`workspace-item ${currentWorkspace === 'MindSpace Engineering HQ' ? 'selected' : ''}`}
                  onClick={() => { setCurrentWorkspace('MindSpace Engineering HQ'); setShowWorkspaceMenu(false); }}
                >
                  <span>🚀 MindSpace Engineering HQ</span>
                  {currentWorkspace === 'MindSpace Engineering HQ' && <Check size={14} className="text-gradient" />}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="navbar-center">
          <div className="search-bar glass-panel">
            <Search size={17} className="text-secondary" />
            <input 
              type="text" 
              placeholder="Search rooms, files, or people..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <kbd>⌘K</kbd>
          </div>
        </div>

        <div className="navbar-right">
          <button className="icon-btn glass-panel notification-btn" title="Notifications" onClick={() => showToast('🔔 All notifications caught up!')}>
            <Bell size={18} />
            <span className="notification-pulse"></span>
          </button>

          <button className="icon-btn glass-panel" onClick={toggleTheme} title="Toggle Dark/Light">
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          
          <button 
            className="btn-secondary" 
            onClick={openJoinModal}
          >
            Join Room
          </button>
          
          <button className="btn-primary flex-center" onClick={() => createRoom()} disabled={isCreatingRoom}>
            <Plus size={18} style={{ marginRight: '0.4rem' }} /> {isCreatingRoom ? 'Creating...' : 'New Room'}
          </button>

          <div className="avatar-dropdown" style={{position: 'relative'}}>
            <div className="avatar glass-panel user-avatar-ring" onClick={() => setShowDropdown(!showDropdown)}>
              <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" />
              <span className="online-indicator"></span>
            </div>
            {showDropdown && (
              <div className="glass-card avatar-popover">
                <div className="avatar-popover-header">
                  <strong>{userName}</strong>
                  <span className="text-secondary text-xs">Architect • Pro Plan</span>
                </div>
                <div className="popover-divider"></div>
                <button className="popover-item" onClick={() => navigate('/settings')}>Settings & Profile</button>
                <button className="popover-item" onClick={() => navigate('/history')}>Session History</button>
                <div className="popover-divider"></div>
                <button className="popover-item text-danger" onClick={() => navigate('/login')}>Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Banner */}
        <header className="page-header flex-center-between">
          <div>
            <div className="welcome-badge">
              <span className="pulse-dot"></span>
              <span>ENTERPRISE COCKPIT ACTIVE</span>
            </div>
            <h1>Welcome back, {userName}</h1>
            <p className="text-secondary">Ready to collaborate in real-time and leverage Agentic AI tools today?</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary btn-sm" onClick={() => navigate('/history')}>
              <Clock size={16} /> Past Meetings
            </button>
          </div>
        </header>

        {/* Enterprise KPI Analytics Grid */}
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

        {/* Quick Actions Bar */}
        <section className="section quick-actions">
          <div className="glass-card action-card bounce-hover" onClick={() => createRoom()}>
            <div className="icon-wrapper bg-gradient">
              <Plus size={22} color="#fff" />
            </div>
            <h3>Create Room</h3>
            <p className="text-secondary">Start a new blank workspace</p>
          </div>
          
          <div className="glass-card action-card bounce-hover" onClick={openJoinModal}>
            <div className="icon-wrapper">
              <Users size={22} className="text-gradient" />
            </div>
            <h3>Join Room</h3>
            <p className="text-secondary">Enter a code to join team</p>
          </div>

          <div className="glass-card action-card" onClick={() => navigate('/history')}>
            <div className="icon-wrapper">
              <Clock size={22} className="text-gradient" />
            </div>
            <h3>View History</h3>
            <p className="text-secondary">Review previous sessions and summaries</p>
          </div>
        </section>

        {/* 1-Click Interactive Workspace Templates */}
        <section className="section">
          <div className="section-header">
            <div>
              <h2>Template Launcher</h2>
              <p className="text-secondary text-sm">Spin up pre-configured boards with one click.</p>
            </div>
          </div>

          <div className="templates-grid">
            {TEMPLATES.map(tmpl => (
              <div 
                key={tmpl.id} 
                className="template-card glass-card bounce-hover"
                onClick={() => createRoom(`${tmpl.title} Workspace`)}
              >
                <div className="template-card-top">
                  <span className="template-icon" style={{ borderColor: tmpl.color }}>{tmpl.icon}</span>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{tmpl.category}</span>
                </div>
                <h4>{tmpl.title}</h4>
                <p className="text-secondary text-xs">{tmpl.desc}</p>
                <div className="template-launch-hint flex-align">
                  <span>Launch Template</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Collaborations */}
        <section className="section">
          <div className="section-header">
            <div>
              <h2>Recent Collaboration Rooms</h2>
              <p className="text-secondary text-sm">Jump straight back into your active whiteboard canvases.</p>
            </div>
            <button className="btn-text" onClick={() => navigate('/history')}>
              View All <ArrowRight size={16} />
            </button>
          </div>
          
          {isLoading ? (
            <div className="recent-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-card room-card skeleton-card">
                  <div className="skeleton-box" style={{width: '40px', height: '40px', borderRadius: '10px'}} />
                  <div className="skeleton-text" style={{width: '70%', marginTop: '1rem'}} />
                  <div className="skeleton-text" style={{width: '40%'}} />
                </div>
              ))}
            </div>
          ) : filteredRooms.length > 0 ? (
            <div className="recent-grid">
              {filteredRooms.map((room) => (
                <div key={room.id} className="glass-card room-card bounce-hover" onClick={() => navigate(`/room/${room.id}`)}>
                  <div className="room-card-header">
                    <div className="room-icon">
                      <MonitorSpeaker size={20} className="text-gradient" />
                    </div>
                    <span className="room-status active flex-align" style={{ gap: '4px' }}>
                      <span className="pulse-dot" style={{ width: '6px', height: '6px' }}></span> {room.status}
                    </span>
                  </div>
                  <h3>{room.title}</h3>
                  <div className="room-code-tag flex-align">
                    <span className="code-text">CODE: {room.id}</span>
                    <button 
                      className="copy-chip-btn" 
                      title="Copy Share Link"
                      onClick={(e) => copyRoomCode(room.id, e)}
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                  <div className="room-card-footer">
                    <div className="participants-stack" aria-label="participants">
                      <div className="avatar-chip-stack">
                        <span className="avatar-chip">👩‍💻</span>
                        <span className="avatar-chip">👨‍🔬</span>
                      </div>
                      <span className="text-secondary text-xs">{room.participantCount} online</span>
                    </div>
                    <button className="btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/room/${room.id}`); }}>
                      <Play size={14} /> Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state glass-panel">
              <div className="empty-icon-wrap">
                <Inbox size={32} className="text-secondary" />
              </div>
              <h3>{searchQuery ? 'No Rooms Match Search' : 'No Active Rooms'}</h3>
              <p className="text-secondary">
                {searchQuery 
                  ? `No workspaces found matching "${searchQuery}".` 
                  : "You don't have any active collaborative rooms yet. Create a blank workspace or launch a template above."}
              </p>
              <button className="btn-primary" onClick={() => createRoom()} style={{marginTop: '1.25rem'}}>
                <Plus size={16} style={{marginRight:'0.4rem'}}/> Create Room
              </button>
            </div>
          )}
        </section>

        {/* History Feed */}
        <section className="section" style={{marginBottom: '3.5rem'}}>
          <div className="section-header">
            <div>
              <h2>Recent Completed Sessions</h2>
              <p className="text-secondary text-sm">Review summaries and decisions generated by your AI Co-Pilot.</p>
            </div>
            <button className="btn-text" onClick={() => navigate('/history')}>
              Open Full Archive <ArrowRight size={16} />
            </button>
          </div>
          
          {isLoading ? (
            <div className="glass-panel history-list">
              {[1, 2, 3].map(i => (
                <div key={i} className="history-item">
                  <div className="skeleton-box" style={{width: '40px', height: '40px', borderRadius: '10px'}} />
                  <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap:'0.5rem'}}>
                    <div className="skeleton-text" style={{width: '40%'}} />
                    <div className="skeleton-text" style={{width: '20%'}} />
                  </div>
                  <div className="skeleton-box" style={{flex: 2, height: '60px', borderRadius:'8px'}} />
                </div>
              ))}
            </div>
          ) : history.length > 0 ? (
            <div className="glass-panel history-list">
              {history.map(item => (
                <div key={item.id} className="history-item" onClick={() => navigate(`/room/${item.roomId}`)}>
                  <div className="history-icon">
                    <Clock size={20} className="text-secondary" />
                  </div>
                  <div className="history-info">
                    <h4>{item.title}</h4>
                    <p className="text-secondary text-xs">
                      {new Date(item.date).toLocaleDateString()} • {item.duration}
                    </p>
                  </div>
                  <div className="history-summary">
                    <p className="text-sm">{item.aiSummary}</p>
                  </div>
                  <div className="history-actions">
                    <button className="btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); navigate('/history'); }}>
                      Review Notes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-secondary">No collaboration history found.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
