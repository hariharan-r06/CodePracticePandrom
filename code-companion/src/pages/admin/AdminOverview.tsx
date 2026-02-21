import React from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Grid3x3, Code2, Clock, Plus, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { toast } from 'sonner';
import AccessDenied from '../AccessDenied';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionsService } from '@/services/submissions.service';
import { patternsService } from '@/services/patterns.service';
import { problemsService } from '@/services/problems.service';

export default function AdminOverview() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: pendingSubs = [] } = useQuery({
    queryKey: ['admin-pending-submissions'],
    queryFn: () => submissionsService.getMySubmissions({ status: 'pending' }),
  });

  const { data: patterns = [] } = useQuery({
    queryKey: ['patterns'],
    queryFn: () => patternsService.getAll(),
  });

  const { data: problems = [] } = useQuery({
    queryKey: ['problems'],
    queryFn: () => problemsService.getAll(),
  });

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await submissionsService.review(id, { status });
      toast.success(`Submission ${status}`);
      queryClient.invalidateQueries({ queryKey: ['admin-pending-submissions'] });
    } catch (err) {
      toast.error('Failed to update submission');
    }
  };

  if (role !== 'admin') return <AccessDenied />;

  const stats = [
    { label: 'Total Students', value: 0, icon: Users, color: 'bg-primary/20 text-primary' },
    { label: 'Total Patterns', value: patterns.length, icon: Grid3x3, color: 'bg-secondary/20 text-secondary' },
    { label: 'Total Problems', value: problems.length, icon: Code2, color: 'bg-success/20 text-success' },
    { label: 'Pending Reviews', value: pendingSubs.length, icon: Clock, color: 'bg-warning/20 text-warning' },
  ];

  return (
    <AppLayout title="Admin Overview">
      <PageWrapper title="Admin Overview">
        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">Admin Overview</h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color} mb-3`}>
                  <s.icon size={18} />
                </div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-heading text-2xl font-bold text-foreground mt-0.5">{s.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/admin/manage')} className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-medium flex items-center gap-2 hover:shadow-glow transition-all">
              <Plus size={16} /> Manage Content
            </button>
            <button onClick={() => navigate('/leaderboard')} className="px-4 py-2.5 rounded-lg bg-secondary/20 text-secondary text-sm font-medium flex items-center gap-2 hover:bg-secondary/30 transition-colors">
              View Leaderboard <ArrowRight size={14} />
            </button>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h4 className="font-heading font-bold text-foreground mb-4">Recent Submissions to Review</h4>
            <div className="space-y-3">
              {pendingSubs.map(s => (
                <div key={s.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors px-2 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {s.profiles?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium truncate">{s.problems?.title || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{s.profiles?.full_name || 'Anonymous'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <a href={s.screenshot_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">View Screenshot</a>
                    <div className="flex gap-2">
                      <button onClick={() => handleReview(s.id, 'approved')} className="w-8 h-8 rounded-lg bg-success/20 text-success flex items-center justify-center hover:bg-success/30 transition-colors">
                        <CheckCircle size={14} />
                      </button>
                      <button onClick={() => handleReview(s.id, 'rejected')} className="w-8 h-8 rounded-lg bg-destructive/20 text-destructive flex items-center justify-center hover:bg-destructive/30 transition-colors">
                        <XCircle size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {pendingSubs.length === 0 && (
                <p className="text-center py-8 text-muted-foreground text-sm">No submissions pending review. All caught up! 🎊</p>
              )}
            </div>
          </div>
        </div>
      </PageWrapper>
    </AppLayout>
  );
}
