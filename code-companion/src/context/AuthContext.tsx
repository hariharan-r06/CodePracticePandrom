import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export type UserRole = 'student' | 'admin';

interface User {
    id: string;
    full_name: string;
    email: string;
    role: UserRole;
    streak: number;
    avatar_url?: string;
    // Convenience getters for legacy components
    name: string;
    initials: string;
}

interface AuthContextType {
    user: User | null;
    role: UserRole;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapUser(raw: any): User {
    const name = raw.full_name || raw.name || 'User';
    const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase();
    return {
        id: raw.id,
        full_name: name,
        email: raw.email || '',
        role: raw.role || 'student',
        streak: raw.streak || 0,
        avatar_url: raw.avatar_url,
        name,
        initials,
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount, check if token exists and fetch user
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }
        api.setToken(token);
        authService.getMe()
            .then((data) => setUser(mapUser(data)))
            .catch(() => {
                api.setToken(null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const { user: userData } = await authService.login(email, password);
            setUser(mapUser(userData));
            toast.success('Logged in successfully!');
            return true;
        } catch (err: any) {
            toast.error(err.message || 'Login failed');
            return false;
        }
    }, []);

    const signup = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
        try {
            const { user: userData } = await authService.signup(name, email, password, role);
            setUser(mapUser(userData));
            toast.success('Account created!');
            return true;
        } catch (err: any) {
            toast.error(err.message || 'Signup failed');
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        toast.info('Logged out');
    }, []);

    const role: UserRole = user?.role || 'student';
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, role, isAuthenticated, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
