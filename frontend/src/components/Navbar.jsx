import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  Plus, 
  Sun, 
  Moon, 
  ChevronDown, 
  Sparkles,
  Command
} from 'lucide-react';
import { apiBaseUrl } from '../config';
import BrandLogo from './BrandLogo';
import { ThemeContext } from '../App';
import './Navbar.css';

export default function Navbar({ onOpenSearch, onNewRoom }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext) || { theme: 'dark', toggleTheme: () => {} };
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState('Personal Workspace');

  const storedUser = JSON.parse(localStorage.getItem('user') || '{"name": "Krishna Anand"}');
  const userInitial = storedUser?.name ? storedUser.name.charAt(0).toUpperCase() : 'K';

  const workspaces = [
    { id: 'ws-1', name: 'Personal Workspace', badge: 'PRO' },
    { id: 'ws-2', name: 'MindSpace Engineering HQ', badge: 'TEAM' },
    { id: 'ws-3', name: 'AI Research Lab', badge: 'DEV' }
  ];

  const handleWhiteboardClick = async (e) => {
    e.preventDefault();
    const lastRoom = localStorage.getItem('livecollab_last_room');
    if (lastRoom) {
      navigate(`/room/${lastRoom}`);
      return;
    }
    try {
      const res = await fetch(`${apiBaseUrl}/api/room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Collaborative Whiteboard' })
      });
      const data = await res.json();
      if (data && data.success && data.roomId) {
        navigate(`/room/${data.roomId}`);
        return;
      }
    } catch {
      // Fallback
    }
    const fallback = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${fallback}`);
  };

  return (
    <header className="enterprise-navbar glass">
      <div className="navbar-left">
        <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <BrandLogo size={36} showText={true} showBadge={true} />
        </div>

        {/* Workspace Switcher */}
        <div className="workspace-switcher-wrapper">
          <button 
            className="workspace-pill-btn"
            onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
            aria-expanded={workspaceDropdownOpen}
          >
            <span className="workspace-dot" />
            <span className="workspace-name">{activeWorkspace}</span>
            <ChevronDown size={14} className={`dropdown-chevron ${workspaceDropdownOpen ? 'open' : ''}`} />
          </button>

          {workspaceDropdownOpen && (
            <div className="workspace-menu glass-panel">
              <div className="workspace-menu-label">SWITCH WORKSPACE</div>
              {workspaces.map(ws => (
                <div 
                  key={ws.id} 
                  className={`workspace-menu-item ${activeWorkspace === ws.name ? 'active' : ''}`}
                  onClick={() => {
                    setActiveWorkspace(ws.name);
                    setWorkspaceDropdownOpen(false);
                  }}
                >
                  <span className="workspace-menu-title">{ws.name}</span>
                  <span className="workspace-menu-badge">{ws.badge}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="navbar-center">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/room" 
          onClick={handleWhiteboardClick}
          className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
        >
          <Layers size={16} />
          <span>Whiteboard</span>
        </NavLink>

        <NavLink 
          to="/history" 
          className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
        >
          <HistoryIcon size={16} />
          <span>History</span>
        </NavLink>

        <NavLink 
          to="/settings" 
          className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
        >
          <SettingsIcon size={16} />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Navbar Right Actions */}
      <div className="navbar-right">
        {/* Global Search / Command Palette Trigger */}
        <button 
          className="nav-search-trigger"
          onClick={onOpenSearch}
          title="Search or type command (⌘K / Ctrl+K)"
        >
          <Command size={14} />
          <span>Search...</span>
          <kbd>⌘K</kbd>
        </button>

        {/* Theme Toggle Button */}
        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Dark and Light Theme"
        >
          {theme === 'dark' ? (
            <Sun size={18} className="theme-icon sun" />
          ) : (
            <Moon size={18} className="theme-icon moon" />
          )}
        </button>

        {/* New Space Quick Action */}
        <button 
          className="btn-primary nav-new-room-btn"
          onClick={onNewRoom ? onNewRoom : () => navigate('/room')}
          title="Create a new collaborative space"
        >
          <Plus size={16} />
          <span>New Space</span>
        </button>

        {/* User Profile Pill */}
        <div 
          className="nav-user-avatar"
          onClick={() => navigate('/settings')}
          title={`Signed in as ${storedUser?.name || 'Krishna Anand'}`}
        >
          <span>{userInitial}</span>
        </div>
      </div>
    </header>
  );
}
