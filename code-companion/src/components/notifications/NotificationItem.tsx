import React from 'react';
import { Grid3x3, Code2, CheckCircle, XCircle, Upload, X } from 'lucide-react';
import { Notification, useNotifications } from '@/context/NotificationContext';
import { formatTimeAgo } from '@/lib/notificationHelpers';
import { cn } from '@/lib/utils';

const iconMap = {
  new_pattern: { Icon: Grid3x3, bg: 'bg-secondary/15', color: 'text-secondary' },
  new_problem: { Icon: Code2, bg: 'bg-primary/15', color: 'text-primary' },
  submission_approved: { Icon: CheckCircle, bg: 'bg-success/15', color: 'text-success' },
  submission_rejected: { Icon: XCircle, bg: 'bg-destructive/15', color: 'text-destructive' },
  new_submission: { Icon: Upload, bg: 'bg-warning/15', color: 'text-warning' },
};

interface Props {
  notification: Notification;
  large?: boolean;
}

export function NotificationItem({ notification: n, large }: Props) {
  const { markAsRead, deleteNotification } = useNotifications();
  const { Icon, bg, color } = iconMap[n.type];

  return (
    <div
      onClick={() => !n.isRead && markAsRead(n.id)}
      className={cn(
        'flex gap-3 border-b border-border/50 cursor-pointer group transition-colors hover:bg-muted/30',
        large ? 'px-6 py-4' : 'px-4 py-3',
        !n.isRead && 'bg-primary/5 border-l-2 border-l-primary'
      )}
    >
      <div className={cn('shrink-0 rounded-full flex items-center justify-center', bg, large ? 'w-11 h-11' : 'w-9 h-9')}>
        <Icon size={large ? 18 : 16} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-foreground', large ? 'text-base' : 'text-sm', !n.isRead && 'font-semibold')}>
          {n.title}
        </p>
        <p className={cn('text-muted-foreground mt-0.5', large ? 'text-sm' : 'text-xs line-clamp-2')}>{n.message}</p>
        {n.meta?.feedbackNote && large && (
          <div className="mt-2 px-3 py-2 rounded border-l-2 border-l-destructive bg-destructive/5 text-xs text-destructive italic">
            Admin feedback: "{n.meta.feedbackNote}"
          </div>
        )}
        <p className={cn('text-muted-foreground mt-1', large ? 'text-xs' : 'text-[11px]')}>
          {large ? n.timestamp.toLocaleString() : formatTimeAgo(n.timestamp)}
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 shrink-0">
        {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary" />}
        <button
          onClick={e => { e.stopPropagation(); deleteNotification(n.id); }}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
