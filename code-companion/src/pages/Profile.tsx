import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Flame, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { profileService } from '@/services/profile.service';
import { submissionsService } from '@/services/submissions.service';
import { toast } from 'sonner';

const diffClass: Record<string, string> = { easy: 'bg-success/20 text-success', medium: 'bg-warning/20 text-warning', hard: 'bg-destructive/20 text-destructive' };

export default function Profile() {
  const { user, role } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getMyProfile(),
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: () => submissionsService.getMySubmissions(),
  });

  const { data: heatmapData = [] } = useQuery({
    queryKey: ['heatmap'],
    queryFn: () => profileService.getHeatmap(),
  });

  // Build heatmap array (364 days)
  const heatmap = useMemo(() => {
    const data: number[] = new Array(364).fill(0);
    if (Array.isArray(heatmapData)) {
      heatmapData.forEach((d: any) => {
        const date = new Date(d.date);
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 86400000);
        if (diff >= 0 && diff < 364) {
          data[363 - diff] = d.count;
        }
      });
    }
    return data;
  }, [heatmapData]);

  const recentSubs = submissions.slice(0, 5);

  const totalSolved = profile?.stats?.completed || submissions.filter((s: any) => s.status === 'approved').length;
  const patternsCompleted = profile?.stats?.patternsCompleted || 0;
  const completionRate = profile?.stats?.completionRate || 0;
  const longestStreak = profile?.stats?.streak || user?.streak || 0;

  const handleSaveName = async () => {
    try {
      await profileService.update({ full_name: name });
      toast.success('Name updated!');
      setEditing(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update name');
    }
  };

  return (
    <AppLayout title="Profile">
      <PageWrapper title="Profile">
        <div className="space-y-6">
          {/* Hero */}
          <div className="glass-card rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {user?.initials}
            </div>
            <div className="text-center sm:text-left flex-1">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="bg-muted border border-border rounded px-3 py-1 text-foreground text-lg font-heading font-bold focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <button onClick={handleSaveName} className="text-xs text-primary">Save</button>
                  <button onClick={() => { setEditing(false); setName(user?.name || ''); }} className="text-xs text-muted-foreground">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-xl font-bold text-foreground">{name || user?.name}</h2>
                  <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-primary transition-colors"><Pencil size={14} /></button>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary capitalize">{role}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Solved', value: totalSolved },
              { label: 'Patterns Completed', value: patternsCompleted },
              { label: 'Completion Rate', value: `${completionRate}%` },
              { label: 'Longest Streak', value: <span>{longestStreak} 🔥</span> },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-heading text-2xl font-bold text-foreground mt-1">{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Heatmap */}
          <div className="glass-card rounded-xl p-5">
            <h4 className="font-heading font-bold text-foreground mb-4">Coding Activity</h4>
            <div className="overflow-x-auto">
              <div className="flex gap-0.5" style={{ minWidth: '700px' }}>
                {Array.from({ length: 52 }, (_, week) => (
                  <div key={week} className="flex flex-col gap-0.5">
                    {Array.from({ length: 7 }, (_, day) => {
                      const idx = week * 7 + day;
                      const val = heatmap[idx] || 0;
                      const opacity = val === 0 ? 'bg-muted' : val <= 1 ? 'bg-primary/20' : val <= 2 ? 'bg-primary/40' : val <= 3 ? 'bg-primary/60' : 'bg-primary';
                      return (
                        <div
                          key={day}
                          className={cn('w-2.5 h-2.5 rounded-[2px] transition-colors', opacity)}
                          title={`${val} problems`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="glass-card rounded-xl p-5">
            <h4 className="font-heading font-bold text-foreground mb-4">Recent Submissions</h4>
            <div className="space-y-3">
              {recentSubs.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No submissions yet.</p>}
              {recentSubs.map((s: any) => (
                <div key={s.id} className="flex items-center gap-3 py-2">
                  {s.status === 'approved' ? (
                    <CheckCircle size={16} className="text-success" />
                  ) : s.status === 'pending' ? (
                    <Clock size={16} className="text-warning" />
                  ) : (
                    <CheckCircle size={16} className="text-destructive" />
                  )}
                  <span className="text-sm text-foreground flex-1">{s.problems?.title || 'Unknown Problem'}</span>
                  {s.problems?.difficulty && (
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full capitalize', diffClass[s.problems.difficulty])}>{s.problems.difficulty}</span>
                  )}
                  <span className="text-xs text-muted-foreground capitalize">{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageWrapper>
    </AppLayout>
  );
}
