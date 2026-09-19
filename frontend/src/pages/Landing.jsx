import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Layers, ShieldCheck, Activity, Users, 
  CheckCircle2, Sun, Moon, Zap, Cpu, Video, Lock, ExternalLink, 
  Check, ArrowUpRight, Play, LayoutTemplate, MessageSquare, Key
} from 'lucide-react';
import { ThemeContext } from '../App';
import BrandLogo from '../components/BrandLogo';
import './Landing.css';

const FEATURES = [
  {
    id: 'ai-copilot',
    icon: Sparkles,
    title: 'Gemini Agentic Co-Pilot',
    category: 'INTELLIGENT SYNTHESIS',
    description: 'Proactively drafts architecture flowcharts, fixes formulas into clean Unicode without raw LaTeX, and generates structured Kanban boards.',
    gradient: 'linear-gradient(135deg, #00f0ff 0%, #7928ca 100%)'
  },
  {
    id: 'whiteboard',
    icon: Layers,
    title: '60 FPS Multiplayer Canvas',
    category: 'REAL-TIME MESH',
    description: 'Ultra-responsive vector drawing, draggable sticky notes, auto-aligning connectors, and multiplayer cursor presence under 15ms.',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)'
  },
  {
    id: 'studio',
    icon: Video,
    title: 'Studio Audio & Video',
    category: 'WEBRTC TELEMETRY',
    description: 'Built-in real-time audio visualizers, mic gain monitoring, and encrypted peer video mesh. Zero third-party meeting apps needed.',
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
  },
  {
    id: 'templates',
    icon: LayoutTemplate,
    title: '1-Click Template Launchers',
    category: 'AGILE ORCHESTRATION',
    description: 'Instantly launch Agile Sprint Boards, Microservices Flowcharts, SWOT Strategic Matrices, and radial Brainstorming clusters.',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
  }
];

const PRICING_TIERS = [
  {
    name: 'Developer',
    price: '$0',
    frequency: 'forever free',
    description: 'Perfect for individual creators, builders, and quick brainstorm sessions.',
    features: [
      'Unlimited collaborative whiteboards',
      'Real-time WebSocket multiplayer sync',
      'Agentic AI Co-Pilot (Standard limits)',
      'Markdown session notes export',
      'Community support'
    ],
    ctaText: 'Launch Free Workspace',
    popular: false
  },
  {
    name: 'Team Pro',
    price: '$19',
    frequency: 'per user / month',
    description: 'For high-velocity engineering, design, and product squads.',
    features: [
      'Everything in Developer, plus:',
      'Dedicated WebRTC audio & video studio',
      'Unlimited Gemini AI Whiteboard executions',
      'Custom workspace templates & branding',
      'Session history vault with recordings',
      'Priority WebSocket mesh SLA'
    ],
    ctaText: 'Start 14-Day Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$49',
    frequency: 'per user / month',
    description: 'Bank-grade compliance, dedicated AI clusters, and customized SLAs.',
    features: [
      'Everything in Team Pro, plus:',
      '99.99% uptime guarantee SLA',
      'Dedicated on-premise / hybrid deployment',
      'SAML 2.0 & Okta / Google SSO integration',
      'Custom Agentic AI fine-tuned models',
      '24/7 dedicated solutions architect'
    ],
    ctaText: 'Contact Enterprise Sales',
    popular: false
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext) || { theme: 'dark', toggleTheme: () => {} };
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  const handleLaunchApp = () => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-page-root">
      {/* Top Enterprise Landing Navbar */}
      <header className="landing-nav glass">
        <div className="landing-nav-container">
          <div className="landing-nav-left" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
            <BrandLogo size={38} showText={true} showBadge={true} />
          </div>

          <nav className="landing-nav-links">
            <a href="#features" className="nav-anchor">Features</a>
            <a href="#architecture" className="nav-anchor">Architecture</a>
            <a href="#templates" className="nav-anchor">Templates</a>
            <a href="#pricing" className="nav-anchor">Pricing</a>
          </nav>

          <div className="landing-nav-actions">
            <button 
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} className="theme-icon sun" /> : <Moon size={18} className="theme-icon moon" />}
            </button>

            <button 
              className="btn-secondary landing-signin-btn"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>

            <button 
              className="btn-primary landing-cta-btn"
              onClick={handleLaunchApp}
            >
              <span>Launch Workspace</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="landing-mesh-bg" />
        <div className="landing-grid-overlay" />

        <div className="landing-hero-content">
          <div className="hero-pill-badge">
            <span className="pulse-dot" />
            <span>MINDSPACE 2.0 • AUTONOMOUS AGENTIC COLLABORATION OS</span>
          </div>

          <h1 className="landing-headline">
            The Infinite Canvas Where <br />
            <span className="text-gradient">High-Performing Teams Co-Create</span> <br />
            with Agentic AI.
          </h1>

          <p className="landing-subheadline">
            Experience ultra-smooth 60 FPS multiplayer whiteboards, crystal-clear WebRTC audio & video, and an autonomous Gemini co-pilot that turns conversations into architecture and code.
          </p>

          <div className="landing-hero-cta-group">
            <button 
              className="btn-primary hero-main-cta"
              onClick={handleLaunchApp}
            >
              <span>Launch Free Workspace</span>
              <ArrowRight size={18} />
            </button>
            <button 
              className="btn-secondary hero-demo-cta"
              onClick={() => navigate('/room?demo=true')}
            >
              <Play size={16} className="text-gradient" />
              <span>Explore Live Canvas</span>
            </button>
          </div>

          {/* Real-Time Telemetry Ribbon */}
          <div className="hero-telemetry-ribbon glass-card">
            <div className="telemetry-item">
              <Activity size={18} color="#10b981" />
              <div className="telemetry-text">
                <strong>&lt; 15ms</strong>
                <span>WebSocket Latency</span>
              </div>
            </div>
            <div className="telemetry-divider" />
            <div className="telemetry-item">
              <ShieldCheck size={18} color="#6366f1" />
              <div className="telemetry-text">
                <strong>99.99%</strong>
                <span>Real-Time Sync SLA</span>
              </div>
            </div>
            <div className="telemetry-divider" />
            <div className="telemetry-item">
              <Lock size={18} color="#00f0ff" />
              <div className="telemetry-text">
                <strong>E2E Encrypted</strong>
                <span>Peer WebRTC Streams</span>
              </div>
            </div>
            <div className="telemetry-divider" />
            <div className="telemetry-item">
              <Sparkles size={18} color="#ec4899" />
              <div className="telemetry-text">
                <strong>Zero LaTeX Bloat</strong>
                <span>Natural Unicode Math</span>
              </div>
            </div>
          </div>

          {/* Simulated Interactive Hero Preview */}
          <div className="hero-preview-frame glass-panel" id="architecture">
            <div className="frame-top-bar">
              <div className="frame-dots">
                <span /><span /><span />
              </div>
              <div className="frame-room-pill">
                <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                <span>ROOM: #LIVE-SPRINT-ARCHITECTURE</span>
              </div>
              <div className="frame-badge">
                <Users size={12} style={{ marginRight: 4 }} />
                <span>3 Peers Live</span>
              </div>
            </div>

            <div className="frame-canvas-stage">
              <div className="frame-node node-gw">
                <Zap size={14} color="#00f0ff" />
                <span>API Gateway</span>
              </div>
              <div className="frame-connector c1">➔</div>
              <div className="frame-node node-ws">
                <Cpu size={14} color="#6366f1" />
                <span>WebSocket Broker</span>
              </div>
              <div className="frame-connector c2">➔</div>
              <div className="frame-node node-ai">
                <Sparkles size={14} color="#ec4899" />
                <span>Agentic AI Co-Pilot</span>
              </div>

              {/* Simulated Floating Peer Cursors */}
              <div className="frame-cursor cursor-krishna">
                <div className="cursor-pointer-triangle" />
                <span className="cursor-label">Krishna (Lead)</span>
              </div>
              <div className="frame-cursor cursor-ai-copilot">
                <Sparkles size={12} />
                <span className="cursor-label">AI Co-Pilot • Generating Flowchart</span>
              </div>

              {/* Formula Demonstration Card */}
              <div className="frame-formula-card glass-card">
                <span className="formula-tag">Sanitized Formula Engine</span>
                <p className="formula-text">6CO₂ + 6H₂O ➔ C₆H₁₂O₆ + 6O₂</p>
                <span className="formula-sub">Zero raw LaTeX tags • Clean Unicode rendered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section (Bento Box) */}
      <section className="landing-section" id="features">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-badge">CORE CAPABILITIES</span>
            <h2>Architected for Elite Engineering & Product Teams</h2>
            <p className="section-subtext">Everything you need to ideate, map distributed systems, and run high-velocity sprints in one unified studio.</p>
          </div>

          <div className="bento-grid">
            {FEATURES.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div key={feat.id} className={`bento-card glass-card bento-${idx + 1}`}>
                  <div className="bento-card-header">
                    <div className="bento-icon-box" style={{ background: `${feat.gradient}` }}>
                      <IconComp size={22} color="#ffffff" />
                    </div>
                    <span className="bento-cat-tag">{feat.category}</span>
                  </div>
                  <h3 className="bento-title">{feat.title}</h3>
                  <p className="bento-desc">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Feature Tabs Section */}
      <section className="landing-section" id="templates">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-badge">AGILE SUITE</span>
            <h2>One Platform. Infinite Workspaces.</h2>
            <p className="section-subtext">Switch between specialized collaboration modes built directly into MindSpace.</p>
          </div>

          <div className="tabs-container">
            <div className="tabs-bar glass-panel">
              <button 
                className={`tab-switch-btn ${activeFeatureTab === 0 ? 'active' : ''}`}
                onClick={() => setActiveFeatureTab(0)}
              >
                <Sparkles size={16} />
                <span>Agentic AI Studio</span>
              </button>
              <button 
                className={`tab-switch-btn ${activeFeatureTab === 1 ? 'active' : ''}`}
                onClick={() => setActiveFeatureTab(1)}
              >
                <LayoutTemplate size={16} />
                <span>Agile Kanban Boards</span>
              </button>
              <button 
                className={`tab-switch-btn ${activeFeatureTab === 2 ? 'active' : ''}`}
                onClick={() => setActiveFeatureTab(2)}
              >
                <Video size={16} />
                <span>Studio Audio & Video</span>
              </button>
            </div>

            <div className="tab-preview-stage glass-card">
              {activeFeatureTab === 0 && (
                <div className="tab-stage-content">
                  <div className="stage-info">
                    <span className="stage-badge">AGENTIC AI CO-PILOT</span>
                    <h3>Natural Language to Canvas Architecture</h3>
                    <p>Ask Gemini to break down complex algorithms or system architectures. The co-pilot writes code, cleans mathematical expressions, and injects interactive nodes directly onto the whiteboard with one click.</p>
                    <ul className="stage-checklist">
                      <li><CheckCircle2 size={16} color="#10b981" /> Converts raw LaTeX into natural Unicode subscript formulas</li>
                      <li><CheckCircle2 size={16} color="#10b981" /> Proactively generates node connectors and flowchart paths</li>
                      <li><CheckCircle2 size={16} color="#10b981" /> Auto-extracts action items, owners, and meeting summaries</li>
                    </ul>
                    <button className="btn-primary" onClick={handleLaunchApp}>
                      Try AI Co-Pilot Free <ArrowRight size={15} />
                    </button>
                  </div>
                  <div className="stage-visual">
                    <div className="visual-code-window glass-panel">
                      <div className="window-header">
                        <span>Gemini 2.5 Whiteboard Co-Pilot</span>
                        <span className="badge badge-success">ACTIVE</span>
                      </div>
                      <div className="window-body">
                        <p className="user-msg">User: "Draw microservices topology with Redis cache"</p>
                        <div className="ai-response-box">
                          <p className="ai-status">⚡ Executing Agentic Action: Node Blueprint</p>
                          <code>{"[API Gateway] ➔ [Auth Service] ➔ [Redis Cluster]"}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeFeatureTab === 1 && (
                <div className="tab-stage-content">
                  <div className="stage-info">
                    <span className="stage-badge">AGILE TEMPLATE ENGINE</span>
                    <h3>High-Velocity Sprint Planning</h3>
                    <p>Launch pre-architected Agile Kanban boards, SWOT strategic matrices, and radial brainstorming clusters in seconds. No manual layout setup required.</p>
                    <ul className="stage-checklist">
                      <li><CheckCircle2 size={16} color="#10b981" /> 3-Stage Kanban (To-Do, In-Progress, Completed)</li>
                      <li><CheckCircle2 size={16} color="#10b981" /> Color-coded sticky note clustering and auto-organize</li>
                      <li><CheckCircle2 size={16} color="#10b981" /> Real-time peer movement and draggable synchronization</li>
                    </ul>
                    <button className="btn-primary" onClick={handleLaunchApp}>
                      Launch Kanban Template <ArrowRight size={15} />
                    </button>
                  </div>
                  <div className="stage-visual">
                    <div className="visual-kanban-preview">
                      <div className="kanban-col c-todo">
                        <span className="col-title">📌 BACKLOG</span>
                        <div className="kanban-card">Setup WebSockets</div>
                      </div>
                      <div className="kanban-col c-prog">
                        <span className="col-title">⚡ IN PROGRESS</span>
                        <div className="kanban-card">Build Agentic AI Co-Pilot</div>
                      </div>
                      <div className="kanban-col c-done">
                        <span className="col-title">✅ DONE</span>
                        <div className="kanban-card">Deploy Neural Design System</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeFeatureTab === 2 && (
                <div className="tab-stage-content">
                  <div className="stage-info">
                    <span className="stage-badge">STUDIO AUDIO & VIDEO</span>
                    <h3>Zero-Friction Peer Collaboration</h3>
                    <p>Crystal-clear WebRTC mesh connectivity lets your engineering team talk, screen-share, and review whiteboards without leaving the tab.</p>
                    <ul className="stage-checklist">
                      <li><CheckCircle2 size={16} color="#10b981" /> Real-time microphone audio visualizer with gain detection</li>
                      <li><CheckCircle2 size={16} color="#10b981" /> Multi-peer video strip with floating draggable docking</li>
                      <li><CheckCircle2 size={16} color="#10b981" /> 1-click room link sharing with zero blocking alerts</li>
                    </ul>
                    <button className="btn-primary" onClick={handleLaunchApp}>
                      Start Live Session <ArrowRight size={15} />
                    </button>
                  </div>
                  <div className="stage-visual">
                    <div className="visual-studio-card glass-panel">
                      <div className="studio-cam-mock">
                        <Video size={36} color="#6366f1" />
                        <span>Live WebRTC Stream Ready</span>
                      </div>
                      <div className="studio-mic-meter">
                        <span>Mic Gain Level</span>
                        <div className="meter-track"><div className="meter-bar" style={{ width: '75%' }} /></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="landing-section" id="pricing">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-badge">TRANSPARENT PRICING</span>
            <h2>Simple, Predictable Plans for Teams of All Sizes</h2>
            <p className="section-subtext">Start free today and scale effortlessly as your team grows.</p>
          </div>

          <div className="pricing-grid">
            {PRICING_TIERS.map(tier => (
              <div key={tier.name} className={`pricing-card glass-card ${tier.popular ? 'popular-tier' : ''}`}>
                {tier.popular && (
                  <div className="popular-badge">
                    <Sparkles size={13} />
                    <span>MOST POPULAR</span>
                  </div>
                )}
                <div className="tier-header">
                  <h3 className="tier-name">{tier.name}</h3>
                  <p className="tier-desc">{tier.description}</p>
                  <div className="tier-price-wrap">
                    <span className="tier-price">{tier.price}</span>
                    <span className="tier-freq">{tier.frequency}</span>
                  </div>
                </div>

                <ul className="tier-features-list">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="tier-feature-item">
                      <Check size={16} className="tier-check-icon" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`tier-cta-btn ${tier.popular ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={handleLaunchApp}
                >
                  {tier.ctaText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <BrandLogo size={36} showText={true} showBadge={true} />
              <p className="footer-tagline">
                The next-generation collaborative workspace engineered for teams building the future with Agentic AI.
              </p>
              <div className="footer-status-pill">
                <span className="status-dot-green" />
                <span>All Systems Operational • 99.99% SLA</span>
              </div>
            </div>

            <div className="footer-nav-col">
              <h4>Platform</h4>
              <button onClick={() => navigate('/dashboard')}>Workspace Hub</button>
              <button onClick={() => navigate('/room')}>Whiteboard Canvas</button>
              <button onClick={() => navigate('/history')}>Session History</button>
              <button onClick={() => navigate('/settings')}>Studio Settings</button>
            </div>

            <div className="footer-nav-col">
              <h4>Resources</h4>
              <a href="https://github.com/Krishnaanand79/live_collab_mindspace" target="_blank" rel="noreferrer">
                GitHub Repository <ExternalLink size={12} />
              </a>
              <button onClick={() => navigate('/login')}>Sign In</button>
              <button onClick={() => navigate('/room?demo=true')}>Demo Workspace</button>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} LiveCollab MindSpace. Developed by Krishna Anand. All rights reserved.</p>
            <div className="footer-bottom-links">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Security Telemetry</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
