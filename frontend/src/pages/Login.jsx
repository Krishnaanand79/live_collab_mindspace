import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Key, Sparkles, AlertCircle, CheckCircle, X, Zap, Eye, EyeOff, ShieldCheck, MousePointer, Activity, Sun, Moon } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { apiBaseUrl } from '../config';
import { ThemeContext } from '../App';
import BrandLogo from '../components/BrandLogo';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext) || { theme: 'dark', toggleTheme: () => {} };
  const [roomCode, setRoomCode] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authNotification, setAuthNotification] = useState(null);

  const fillDemoAccount = () => {
    setName('Krishna Anand');
    setEmail('demo@livecollab.ai');
    setPassword('demopassword123');
    setAuthNotification({
      type: 'success',
      message: '⚡ Demo credentials filled! Click Sign In or Create Account.'
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthNotification(null);
    const accounts = JSON.parse(localStorage.getItem('livecollab_accounts') || '[]');

    if (isSignUp) {
      const existing = accounts.find(acc => acc.email.toLowerCase() === email.trim().toLowerCase());
      if (existing) {
        setAuthNotification({
          type: 'error',
          message: 'An account with this email already exists. Please sign in.'
        });
        setIsSignUp(false);
        return;
      }

      const user = {
        name: name.trim() || email.split('@')[0],
        email: email.trim(),
        picture: null,
        local: true
      };
      const nextAccounts = [...accounts, { ...user, password }];
      localStorage.setItem('livecollab_accounts', JSON.stringify(nextAccounts));
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
      return;
    }

    // Check existing or demo fallback
    let account = accounts.find(
      acc => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.password === password
    );
    
    // Auto-allow demo account if not found
    if (!account && email.trim() === 'demo@livecollab.ai') {
      account = { name: 'Krishna Anand', email: 'demo@livecollab.ai' };
    }

    if (!account) {
      setAuthNotification({
        type: 'error',
        message: 'Invalid email or password. If you are new, click Create one.'
      });
      return;
    }

    localStorage.setItem('user', JSON.stringify({
      name: account.name,
      email: account.email,
      picture: account.picture || null,
      local: true
    }));
    navigate('/dashboard');
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    setAuthNotification(null);
    const code = roomCode.trim().toUpperCase();
    if (code) {
      fetch(`${apiBaseUrl}/api/room/${code}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Room not found');
          }
          navigate(`/room/${code}`);
        })
        .catch(() => {
          setAuthNotification({
            type: 'error',
            message: 'Room not found. Please check the code and try again.'
          });
        });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setAuthNotification(null);
      const res = await fetch(`${apiBaseUrl}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        const detailText = data.details ? ` (${data.details})` : '';
        setAuthNotification({
          type: 'error',
          message: `Authentication failed: ${data.error || 'Unknown error'}${detailText}`
        });
      }
    } catch (err) {
      console.error(err);
      setAuthNotification({
        type: 'error',
        message: 'Error reaching authentication server.'
      });
    }
  };

  const handleGoogleError = () => {
    console.error('Login Failed');
    setAuthNotification({
      type: 'error',
      message: 'Google Sign-In was cancelled or failed.'
    });
  };

  return (
    <div className="login-split-container">
      {/* Top Floating Controls */}
      <div className="login-top-bar">
        <button 
          className="theme-toggle-btn login-theme-toggle" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Dark and Light Theme"
        >
          {theme === 'dark' ? <Sun size={18} className="theme-icon sun" /> : <Moon size={18} className="theme-icon moon" />}
        </button>
      </div>

      {/* Left side: Enterprise Product Showcase */}
      <div className="login-hero-side">
        <div className="hero-overlay"></div>
        <div className="hero-mesh-background"></div>
        
        <div className="hero-content">
          <div className="hero-badge-pill">
            <span className="pulse-dot"></span>
            <span>LIVECOLLAB MINDSPACE • NEXT-GEN AI WHITEBOARD</span>
          </div>

          <div className="hero-brand-wrap">
            <BrandLogo size={52} showText={true} showBadge={true} />
          </div>

          <h1 className="hero-headline">
            Where high-performing teams <br/>
            <span className="text-gradient">co-create with Agentic AI.</span>
          </h1>
          <p className="hero-subtitle">
            Combines ultra-smooth 60 FPS multiplayer canvas, crystal-clear WebRTC collaboration, and an intelligent Gemini whiteboard co-pilot.
          </p>

          {/* Interactive Simulated Product Canvas */}
          <div className="hero-live-preview glass-card">
            <div className="preview-top-bar">
              <div className="preview-window-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="preview-title">Room: #ARCHITECTURE-SPRINT</span>
              <span className="badge badge-success flex-align" style={{ gap: '4px', fontSize: '0.7rem' }}>
                <span className="pulse-dot" style={{ width: '6px', height: '6px' }}></span> LIVE
              </span>
            </div>

            <div className="preview-canvas-area">
              <div className="preview-node node-1">
                <span className="node-icon">🚀</span>
                <strong>API Gateway</strong>
              </div>
              <div className="preview-arrow arrow-1">➔</div>
              <div className="preview-node node-2">
                <span className="node-icon">⚡</span>
                <strong>WebSocket Core</strong>
              </div>
              <div className="preview-arrow arrow-2">➔</div>
              <div className="preview-node node-3">
                <span className="node-icon">🤖</span>
                <strong>Gemini AI Copilot</strong>
              </div>

              {/* Simulated Floating User Cursor Chips */}
              <div className="preview-cursor cursor-user">
                <MousePointer size={14} className="cursor-icon" />
                <span>Krishna (Lead)</span>
              </div>
              <div className="preview-cursor cursor-ai">
                <Sparkles size={14} className="cursor-icon" />
                <span>Agentic AI • Drafting Diagram</span>
              </div>
            </div>

            <div className="preview-footer-stats">
              <div className="stat-pill">
                <Activity size={12} color="#10b981" />
                <span>&lt; 15ms Latency</span>
              </div>
              <div className="stat-pill">
                <ShieldCheck size={12} color="#6366f1" />
                <span>E2E Encrypted</span>
              </div>
              <div className="stat-pill">
                <Sparkles size={12} color="#ec4899" />
                <span>Agentic Canvas Actions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Modern Auth Form */}
      <div className="login-form-side">
        <div className="login-form-wrapper">
          <div className="login-header-mobile">
            <BrandLogo size={42} showText={true} showBadge={true} />
          </div>

          <div className="auth-tab-selector" role="tablist">
            <div 
              role="tab" 
              tabIndex={0}
              className={`auth-tab ${!isSignUp ? 'active' : ''}`}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </div>
            <div 
              role="tab" 
              tabIndex={0}
              className={`auth-tab ${isSignUp ? 'active' : ''}`}
              onClick={() => setIsSignUp(true)}
            >
              Create Account
            </div>
          </div>
          
          <div className="form-titles">
            <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-secondary">
              {isSignUp ? 'Enter your details to create your secure workspace profile.' : 'Sign in to access your collaborative workspaces and team whiteboards.'}
            </p>
          </div>

          {authNotification && (
            <div className={`auth-banner auth-banner-${authNotification.type}`} role="alert">
              {authNotification.type === 'error' ? <AlertCircle size={18} className="auth-banner-icon" /> : <CheckCircle size={18} className="auth-banner-icon" />}
              <span className="auth-banner-text">{authNotification.message}</span>
              <button 
                type="button" 
                className="auth-banner-close" 
                onClick={() => setAuthNotification(null)}
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form">
            {isSignUp && (
              <div className="form-group floating-input">
                <div className="input-icon-wrapper">
                  <Mail className="input-icon text-secondary" size={18} />
                  <input
                    type="text"
                    className="input-glass input-with-icon"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group floating-input">
              <div className="input-icon-wrapper">
                <Mail className="input-icon text-secondary" size={18} />
                <input
                  type="email"
                  id="email"
                  className="input-glass input-with-icon"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group floating-input">
              <div className="input-icon-wrapper">
                <Lock className="input-icon text-secondary" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="pass"
                  className="input-glass input-with-icon"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-options" style={{ visibility: isSignUp ? 'hidden' : 'visible' }}>
              <label className="checkbox-wrap">
                <input type="checkbox" defaultChecked />
                <span className="text-secondary text-sm">Remember me</span>
              </label>
              <button 
                type="button" 
                className="demo-fill-btn"
                onClick={fillDemoAccount}
              >
                <Zap size={14} /> Fill Demo
              </button>
            </div>

            <button type="submit" className="btn-primary auth-submit flex-center">
              {isSignUp ? 'Create Account' : 'Sign In'} <LogIn size={18} style={{marginLeft: '0.5rem'}} />
            </button>
          </form>

          <div className="divider"><span>OR CONTINUE WITH</span></div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme={theme === 'dark' ? 'filled_black' : 'outline'}
              shape="pill"
              size="large"
            />
          </div>

          <div className="join-room-card glass-panel">
            <h4 className="text-secondary text-sm font-medium mb-3">HAVE A ROOM CODE?</h4>
            <form onSubmit={handleJoinRoom} className="join-form">
              <div className="input-icon-wrapper flex-1">
                <Key className="input-icon text-secondary" size={18} />
                <input 
                  type="text" 
                  className="input-glass input-with-icon" 
                  placeholder="Enter Code" 
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  style={{ borderRadius: '12px 0 0 12px' }}
                  required 
                />
              </div>
              <button type="submit" className="btn-secondary join-btn">
                Join
              </button>
            </form>
          </div>

          <p className="signup-link text-center text-secondary text-sm">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              className="login-switch-btn font-medium"
              onClick={() => setIsSignUp(prev => !prev)}
            >
              {isSignUp ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
