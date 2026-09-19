import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Video, Mic, Bell, Sparkles, MonitorSpeaker, CheckCircle2, 
  Volume2, ShieldCheck, Sun, Moon, Cpu, Zap, Check, Sliders
} from 'lucide-react';
import { ThemeContext } from '../App';
import './Settings.css';

const AI_PERSONAS = [
  {
    id: 'agentic',
    title: 'Autonomous Co-Pilot',
    badge: 'Recommended',
    desc: 'Actively plans diagrams, automatically draws flowcharts and builds Kanban boards directly from meeting context.',
    icon: '🤖'
  },
  {
    id: 'technical',
    title: 'Technical Architect',
    badge: 'Engineering',
    desc: 'Generates concise system architecture notes, data schemas, API flows, and formatted Unicode math formulas.',
    icon: '⚡'
  },
  {
    id: 'strategic',
    title: 'Strategic Partner',
    badge: 'Product & Exec',
    desc: 'Synthesizes high-level SWOT matrices, risk mitigations, executive summaries, and action item ownership.',
    icon: '💡'
  }
];

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('profile');

  const [displayName, setDisplayName] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('user') || '{}');
    return saved.name || 'Krishna Anand';
  });
  const [email, setEmail] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('user') || '{}');
    return saved.email || 'krishnaanand1207@gmail.com';
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem('livecollab_user_role') || 'Lead Full-Stack Architect';
  });
  const [aiPersona, setAiPersona] = useState(() => {
    return localStorage.getItem('livecollab_ai_persona') || 'agentic';
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updated = {
      ...currentUser,
      name: displayName.trim() || 'Collaborator',
      email: email.trim()
    };
    localStorage.setItem('user', JSON.stringify(updated));
    localStorage.setItem('livecollab_user_role', role);
    localStorage.setItem('livecollab_ai_persona', aiPersona);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'audio-video', icon: Video, label: 'Audio & Video' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'ai', icon: Sparkles, label: 'AI Preferences' }
  ];

  return (
    <div className="settings-container">
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

      <main className="settings-main">
        <header className="page-header">
          <div className="welcome-badge">
            <span className="pulse-dot"></span>
            <span>SYSTEM & WORKSPACE PREFERENCES</span>
          </div>
          <h1>Settings</h1>
          <p className="text-secondary">Manage your profile, AI Co-Pilot personality, and studio devices.</p>
        </header>

        {saveSuccess && (
          <div className="settings-save-toast flex-align">
            <CheckCircle2 size={18} className="text-gradient" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div className="settings-layout">
          {/* Settings Sidebar */}
          <aside className="settings-sidebar">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </aside>

          {/* Settings Content */}
          <section className="settings-content glass-panel">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="settings-section">
                <div className="section-title-wrap">
                  <h3>Profile Information</h3>
                  <p className="text-secondary text-xs">Your identity visible to team members in collaboration rooms.</p>
                </div>

                <div className="profile-edit">
                  <div className="avatar-preview-wrap">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="profile-avatar" />
                    <span className="avatar-online-dot"></span>
                  </div>
                  <div className="profile-edit-info">
                    <strong>{displayName}</strong>
                    <span className="text-secondary text-xs">{role}</span>
                    <button className="btn-secondary btn-sm" onClick={() => handleSave()} style={{ marginTop: '0.4rem' }}>
                      Update Avatar
                    </button>
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Display Name</label>
                    <input 
                      type="text" 
                      className="input-glass" 
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Space</label>
                    <input 
                      type="email" 
                      className="input-glass" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label>Team Role / Title</label>
                  <input 
                    type="text" 
                    className="input-glass" 
                    value={role}
                    onChange={e => setRole(e.target.value)}
                  />
                </div>
                
                <h3 style={{ marginTop: '2.25rem' }}>Workspace Appearance</h3>
                <div className="theme-selector-cards">
                  <div 
                    className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => theme !== 'dark' && toggleTheme()}
                  >
                    <div className="theme-card-preview dark-preview">
                      <div className="mini-topbar"></div>
                      <div className="mini-content"></div>
                    </div>
                    <div className="theme-card-meta flex-align">
                      <Moon size={16} />
                      <span>Obsidian Dark</span>
                      {theme === 'dark' && <Check size={14} className="text-gradient" style={{ marginLeft: 'auto' }} />}
                    </div>
                  </div>

                  <div 
                    className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => theme !== 'light' && toggleTheme()}
                  >
                    <div className="theme-card-preview light-preview">
                      <div className="mini-topbar"></div>
                      <div className="mini-content"></div>
                    </div>
                    <div className="theme-card-meta flex-align">
                      <Sun size={16} />
                      <span>Clean Light</span>
                      {theme === 'light' && <Check size={14} className="text-gradient" style={{ marginLeft: 'auto' }} />}
                    </div>
                  </div>
                </div>
                
                <div className="settings-actions" style={{ marginTop: '2rem' }}>
                  <button className="btn-primary" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Audio & Video Studio Tab */}
            {activeTab === 'audio-video' && (
              <div className="settings-section">
                <div className="section-title-wrap">
                  <h3>Studio Audio & Video</h3>
                  <p className="text-secondary text-xs">Configure your media devices and preview real-time hardware status.</p>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Camera Selection</label>
                    <select className="input-glass">
                      <option>FaceTime HD Camera (Integrated)</option>
                      <option>OBS Virtual Camera Studio</option>
                      <option>External 4K StreamCam</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Microphone Selection</label>
                    <select className="input-glass">
                      <option>MacBook Pro Microphone Array</option>
                      <option>USB Studio Condenser Mic</option>
                    </select>
                  </div>
                </div>

                {/* Simulated Audio Visualizer Bar */}
                <div className="audio-meter-wrap glass-card">
                  <div className="flex-align" style={{ gap: '0.5rem', marginBottom: '0.65rem' }}>
                    <Volume2 size={16} className="text-gradient" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Mic Input Visualizer</span>
                    <span className="badge badge-success" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                      Optimal Gain
                    </span>
                  </div>
                  <div className="audio-meter-bar">
                    <div className="meter-fill" style={{ width: '68%' }}></div>
                  </div>
                </div>

                <h3 style={{marginTop: '2rem'}}>Camera Live Preview</h3>
                <div className="camera-preview">
                  <div className="preview-placeholder">
                    <div className="camera-lens-icon">
                      <Video size={36} color="#6366f1" />
                    </div>
                    <strong>Camera Ready</strong>
                    <p className="text-secondary text-xs">Live peer video stream starts when room is joined</p>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="settings-section">
                <div className="section-title-wrap">
                  <h3>Email & Notifications</h3>
                  <p className="text-secondary text-xs">Manage workspace alerts, peer invites and AI digest settings.</p>
                </div>

                <div className="setting-row">
                  <div>
                    <h4>Room Invites</h4>
                    <p className="text-secondary text-sm">Get notified when someone invites you</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-row">
                  <div>
                    <h4>AI Summary Ready</h4>
                    <p className="text-secondary text-sm">Receive email when meeting notes are parsed</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-row">
                  <div>
                    <h4>Multiplayer Cursor Sounds</h4>
                    <p className="text-secondary text-sm">Play subtle audio click when team members connect</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            )}

            {/* AI Preferences Tab */}
            {activeTab === 'ai' && (
              <div className="settings-section">
                <div className="section-title-wrap">
                  <h3 className="flex-align" style={{ gap: '0.5rem' }}>
                    <Sparkles size={20} className="text-gradient" /> AI Preferences & Personas
                  </h3>
                  <p className="text-secondary text-xs">Select how Gemini AI should assist your team on the canvas.</p>
                </div>

                {/* AI Persona Selector Cards */}
                <div className="persona-cards-grid">
                  {AI_PERSONAS.map(p => (
                    <div 
                      key={p.id}
                      className={`persona-card glass-card ${aiPersona === p.id ? 'active' : ''}`}
                      onClick={() => setAiPersona(p.id)}
                    >
                      <div className="persona-card-header">
                        <span className="persona-icon">{p.icon}</span>
                        <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{p.badge}</span>
                      </div>
                      <h4>{p.title}</h4>
                      <p className="text-secondary text-xs">{p.desc}</p>
                      {aiPersona === p.id && (
                        <div className="persona-active-badge flex-align">
                          <Check size={13} /> Active Persona
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="setting-row" style={{ marginTop: '2rem' }}>
                  <div>
                    <h4>Auto-Summarize Meetings</h4>
                    <p className="text-secondary text-sm">AI will automatically generate notes at the end of a session</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="setting-row">
                  <div>
                    <h4>Action Items Extraction</h4>
                    <p className="text-secondary text-sm">Identify tasks and assignments from spoken words</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="settings-actions" style={{ marginTop: '2rem' }}>
                  <button className="btn-primary" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
