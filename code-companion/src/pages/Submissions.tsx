import React from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { submissionsService } from '@/services/submissions.service';

const diffClass: Record<string, string> = { easy: 'bg-success/20 text-success', medium: 'bg-warning/20 text-warning', hard: 'bg-destructive/20 text-destructive' };
const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  approved: { icon: <CheckCircle size={14} />, color: 'text-success', label: 'Approved' },
  pending: { icon: <Clock size={14} />, color: 'text-warning', label: 'Pending' },
  rejected: { icon: <XCircle size={14} />, color: 'text-destructive', label: 'Rejected' },
};

export default function Submissions() {
  const { user } = useAuth();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['my-submissions'],
    queryFn: () => submissionsService.getMySubmissions(),
  });

  return (
    <AppLayout title="Submissions">
      <PageWrapper title="Submissions">
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">My Submissions</h2>
            <p className="text-muted-foreground text-sm mt-1">Track all your solution submissions</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-medium">No submissions yet</p>
              <p className="text-sm mt-1">Submit your first solution from the Problems page!</p>
            </div>
          ) : (
            <div className="glass-card rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="px-4 py-3 text-left">Problem</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Difficulty</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left hidden sm:table-cell">Date</th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s: any, i: number) => {
                    const status = statusConfig[s.status] || statusConfig.pending;
                    return (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-foreground">{s.problems?.title || 'Unknown'}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {s.problems?.difficulty && (
                            <span className={cn('text-[10px] px-2 py-0.5 rounded-full capitalize', diffClass[s.problems.difficulty])}>
                              {s.problems.difficulty}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className={cn('flex items-center gap-1.5 text-xs font-medium', status.color)}>
                            {status.icon} {status.label}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted-foreground">
                          {new Date(s.submitted_at || s.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground italic truncate max-w-[200px]">
                          {s.feedback || '-'}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </PageWrapper>
    </AppLayout>
  );
}
