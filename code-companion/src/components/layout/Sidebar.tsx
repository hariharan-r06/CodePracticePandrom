import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Grid3x3, Code2, Upload, Trophy, User, Shield, Settings, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const mainNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Patterns', icon: Grid3x3, path: '/patterns' },
  { label: 'Problems', icon: Code2, path: '/problems' },
  { label: 'Submissions', icon: Upload, path: '/submissions' },
  { label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
  { label: 'Profile', icon: User, path: '/profile' },
];

const adminNav = [
  { label: 'Admin Overview', icon: Shield, path: '/admin' },
  { label: 'Manage Content', icon: Settings, path: '/admin/manage' },
];

export function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col fixed left-0 top-0 h-screen border-r border-border bg-card z-40 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-border shrink-0">
        <span className="text-primary font-mono font-bold text-lg">{'{ }'}</span>
        {!collapsed && <span className="font-heading font-bold text-foreground tracking-tight">CodePractice</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {mainNav.map(item => {
          const active = pathname === item.path || (item.path === '/problems' && pathname.startsWith('/problems'));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}

        {role === 'admin' && (
          <>
            <div className="my-3 mx-3 border-t border-border" />
            {adminNav.map(item => {
              const active = pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-primary/10 text-primary border-l-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <item.icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </>
        )}
      </nav>

      {/* Bottom user area */}
      <div className="p-3 border-t border-border space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {user?.initials || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
          )}
          <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
