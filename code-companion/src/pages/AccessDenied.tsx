import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <AppLayout title="Access Denied">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Lock size={32} className="text-destructive" />
        </div>
        <h2 className="font-heading text-xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground text-sm mb-6">You don't have permission to access this page.</p>
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>
    </AppLayout>
  );
}
