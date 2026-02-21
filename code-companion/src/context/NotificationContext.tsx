import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';
import { notificationsService } from '@/services/notifications.service';
import { useAuth } from './AuthContext';
import { api } from '@/lib/api';

export type NotificationType = 'new_problem' | 'new_pattern' | 'submission_approved' | 'submission_rejected' | 'new_submission';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    forRole: string;
    meta?: Record<string, any>;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (n: Omit<Notification, 'id'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    clearAll: () => void;
    refetch: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function mapNotification(raw: any): Notification {
    return {
        id: raw.id,
        type: raw.type,
        title: raw.title,
        message: raw.message,
        timestamp: new Date(raw.created_at || raw.timestamp || Date.now()),
        isRead: raw.is_read ?? raw.isRead ?? false,
        forRole: raw.for_role ?? raw.forRole ?? 'all',
        meta: raw.meta,
    };
}

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const eventSourceRef = useRef<EventSource | null>(null);

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const data = await notificationsService.getAll();
            setNotifications(data.map(mapNotification));
        } catch {
            // silently fail
        }
    }, [isAuthenticated]);

    // Fetch on auth
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // SSE connection
    useEffect(() => {
        if (!isAuthenticated) return;
        const token = api.getToken();
        if (!token) return;

        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const url = `${baseUrl}/notifications/stream`;

        // Using fetch-based SSE since EventSource doesn't support Authorization header
        const abortController = new AbortController();

        const connectSSE = async () => {
            try {
                const response = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    signal: abortController.signal,
                });

                if (!response.ok || !response.body) return;

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.type !== 'connected') {
                                    setNotifications(prev => [mapNotification(data), ...prev]);
                                }
                            } catch {
                                // ignore parse errors
                            }
                        }
                    }
                }
            } catch {
                // Connection closed or aborted
            }
        };

        connectSSE();

        return () => {
            abortController.abort();
        };
    }, [isAuthenticated]);

    const addNotification = useCallback((n: Omit<Notification, 'id'>) => {
        // This is now handled server-side, but keep for any local additions
        const local: Notification = {
            ...n,
            id: `local-${Date.now()}-${Math.random()}`,
        };
        setNotifications(prev => [local, ...prev]);
    }, []);

    const markAsRead = useCallback(async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        try {
            await notificationsService.markAsRead(id);
        } catch {
            // ignore
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        try {
            await notificationsService.markAllAsRead();
        } catch {
            // ignore
        }
    }, []);

    const deleteNotification = useCallback(async (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        try {
            await notificationsService.deleteNotification(id);
        } catch {
            // ignore
        }
    }, []);

    const clearAll = useCallback(async () => {
        setNotifications([]);
        try {
            await notificationsService.clearAll();
        } catch {
            // ignore
        }
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, deleteNotification, clearAll, refetch: fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
    return ctx;
}
