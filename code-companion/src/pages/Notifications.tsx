import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useNotifications } from '@/context/NotificationContext';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const filterTabs = ['All', 'Unread', 'Patterns', 'Problems', 'Submissions'];

export default function Notifications() {
  const { notifications, markAllAsRead, clearAll } = useNotifications();
  const [filter, setFilter] = useState('All');

  const filtered = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.isRead;
    if (filter === 'Patterns') return n.type === 'new_pattern';
    if (filter === 'Problems') return n.type === 'new_problem';
    if (filter === 'Submissions') return ['submission_approved', 'submission_rejected', 'new_submission'].includes(n.type);
    return true;
  });

  // Group by date
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const groups: { label: string; items: typeof filtered }[] = [];
  const todayItems = filtered.filter(n => n.timestamp.toDateString() === today);
  const yesterdayItems = filtered.filter(n => n.timestamp.toDateString() === yesterday);
  const earlierItems = filtered.filter(n => n.timestamp.toDateString() !== today && n.timestamp.toDateString() !== yesterday);
  if (todayItems.length) groups.push({ label: 'Today', items: todayItems });
  if (yesterdayItems.length) groups.push({ label: 'Yesterday', items: yesterdayItems });
  if (earlierItems.length) groups.push({ label: 'Earlier', items: earlierItems });

  return (
    <AppLayout title="Notifications">
      <PageWrapper title="Notifications">
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Notifications</h2>
            <p className="text-muted-foreground text-sm mt-1">Stay up to date with all activity</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex gap-2 overflow-x-auto">
              {filterTabs.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={cn('text-xs font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap',
                    filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={markAllAsRead} className="text-xs text-muted-foreground hover:text-primary transition-colors">Mark all as read</button>
              <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-destructive transition-colors">Clear all</button>
            </div>
          </div>

          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Bell size={40} className="text-muted-foreground/50 mb-4" />
              <h3 className="font-heading font-bold text-foreground">No notifications</h3>
              <p className="text-sm text-muted-foreground mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groups.map(g => (
                <div key={g.label}>
                  <div className="flex items-center gap-3 mb-3 sticky top-14 bg-background/80 backdrop-blur-sm py-2 z-10">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{g.label}</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="glass-card rounded-xl overflow-hidden">
                    {g.items.map(n => <NotificationItem key={n.id} notification={n} large />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    </AppLayout>
  );
}
