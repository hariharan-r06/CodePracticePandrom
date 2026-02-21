import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotifications, NotificationType } from '@/context/NotificationContext';
import { NotificationItem } from './NotificationItem';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const filterTabs = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Patterns', value: 'new_pattern' },
  { label: 'Problems', value: 'new_problem' },
  { label: 'Submissions', value: 'submissions' },
];

interface Props { onClose: () => void; }

export function NotificationPanel({ onClose }: Props) {
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotifications();
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    if (filter === 'submissions') return ['submission_approved', 'submission_rejected', 'new_submission'].includes(n.type);
    return n.type === filter;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-card border border-border rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-heading font-semibold text-sm text-foreground">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">{unreadCount} new</span>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={markAllAsRead} className="text-[11px] text-muted-foreground hover:text-primary transition-colors">Mark all read</button>
          <button onClick={clearAll} className="text-[11px] text-muted-foreground hover:text-destructive transition-colors">Clear all</button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-3 py-2 border-b border-border flex gap-1 overflow-x-auto">
        {filterTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              'text-[11px] font-medium px-3 py-1 rounded-full transition-colors whitespace-nowrap',
              filter === tab.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <Bell size={32} className="mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-foreground">No notifications</p>
            <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
          </div>
        ) : (
          filtered.map(n => <NotificationItem key={n.id} notification={n} />)
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border text-center">
        <button
          onClick={() => { navigate('/notifications'); onClose(); }}
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all notifications →
        </button>
      </div>
    </motion.div>
  );
}
