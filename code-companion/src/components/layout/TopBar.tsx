import React from 'react';
import { Search, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NotificationBell } from '@/components/notifications/NotificationBell';

interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  const { user } = useAuth();

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
      <h1 className="font-heading font-bold text-lg text-foreground">{title}</h1>
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
          <Search size={18} />
        </button>
        <NotificationBell />
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
          {user?.initials || <User size={14} />}
        </div>
      </div>
    </header>
  );
}
