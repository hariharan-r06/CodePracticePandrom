import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Grid3x3, Code2, Upload, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { icon: LayoutDashboard, path: '/dashboard', label: 'Home' },
  { icon: Grid3x3, path: '/patterns', label: 'Patterns' },
  { icon: Code2, path: '/problems', label: 'Problems' },
  { icon: Upload, path: '/submissions', label: 'Submit' },
  { icon: Trophy, path: '/leaderboard', label: 'Rank' },
];

export function MobileNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around z-50">
      {tabs.map(tab => {
        const active = pathname === tab.path || (tab.path === '/problems' && pathname.startsWith('/problems'));
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={cn(
              'flex flex-col items-center gap-0.5 transition-colors',
              active ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <tab.icon size={20} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
