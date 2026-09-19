import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard, 
  Layers, 
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  PlusCircle, 
  LogIn, 
  Sun, 
  Moon, 
  Sparkles, 
  ArrowRight,
  X
} from 'lucide-react';
import { ThemeContext } from '../App';
import './CommandPalette.css';

export default function CommandPalette({ isOpen, onClose, onOpenJoinModal, onNewRoom }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext) || { theme: 'dark', toggleTheme: () => {} };

  const commands = [
    {
      category: 'Navigation',
      items: [
        { id: 'nav-dash', label: 'Go to Dashboard', icon: LayoutDashboard, action: () => navigate('/dashboard') },
        { id: 'nav-room', label: 'Go to Collaborative Canvas', icon: Layers, action: () => navigate('/room') },
        { id: 'nav-hist', label: 'View Session History', icon: HistoryIcon, action: () => navigate('/history') },
        { id: 'nav-sett', label: 'Open Studio Settings', icon: SettingsIcon, action: () => navigate('/settings') }
      ]
    },
    {
      category: 'Quick Actions',
      items: [
        { id: 'act-new', label: 'Create New Collaboration Room', icon: PlusCircle, action: () => { onClose(); if (onNewRoom) onNewRoom(); else navigate('/room'); } },
        { id: 'act-join', label: 'Join Room with Code', icon: LogIn, action: () => { onClose(); if (onOpenJoinModal) onOpenJoinModal(); } },
        { id: 'act-theme', label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, icon: theme === 'dark' ? Sun : Moon, action: () => { toggleTheme(); onClose(); } }
      ]
    },
    {
      category: 'Templates & Architecture',
      items: [
        { id: 'tpl-kanban', label: 'Launch Agile Sprint Board Template', icon: Sparkles, action: () => navigate('/room?template=kanban') },
        { id: 'tpl-arch', label: 'Launch System Architecture Flowchart', icon: Sparkles, action: () => navigate('/room?template=architecture') },
        { id: 'tpl-swot', label: 'Launch SWOT Strategic Analysis', icon: Sparkles, action: () => navigate('/room?template=swot') }
      ]
    }
  ];

  const flatItems = commands.flatMap(cat => 
    cat.items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, flatItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatItems.length) % Math.max(1, flatItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatItems[selectedIndex]) {
          flatItems[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="palette-overlay" onClick={onClose}>
      <div className="palette-dialog glass-panel" onClick={e => e.stopPropagation()}>
        <div className="palette-search-bar">
          <Search className="palette-search-icon" size={20} />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Type a command or search workspace..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="palette-input"
          />
          <button className="palette-close-btn" onClick={onClose} aria-label="Close Command Palette">
            <X size={18} />
          </button>
        </div>

        <div className="palette-results">
          {flatItems.length === 0 ? (
            <div className="palette-empty">
              <p>No matching commands found for "{query}"</p>
            </div>
          ) : (
            commands.map(category => {
              const matchedCategoryItems = category.items.filter(item => 
                item.label.toLowerCase().includes(query.toLowerCase())
              );
              if (matchedCategoryItems.length === 0) return null;

              return (
                <div key={category.category} className="palette-group">
                  <div className="palette-group-title">{category.category}</div>
                  {matchedCategoryItems.map(item => {
                    const globalIdx = flatItems.findIndex(fi => fi.id === item.id);
                    const isSelected = globalIdx === selectedIndex;
                    const IconComponent = item.icon;

                    return (
                      <div 
                        key={item.id} 
                        className={`palette-item ${isSelected ? 'selected' : ''}`}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        onClick={() => {
                          item.action();
                          onClose();
                        }}
                      >
                        <div className="palette-item-left">
                          <IconComponent size={17} className="palette-item-icon" />
                          <span className="palette-item-label">{item.label}</span>
                        </div>
                        <ArrowRight size={14} className="palette-item-arrow" />
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div className="palette-footer">
          <span className="palette-hint"><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
          <span className="palette-hint"><kbd>↵</kbd> to select</span>
          <span className="palette-hint"><kbd>esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
