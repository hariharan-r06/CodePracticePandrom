import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Video, MonitorPlay, CheckCircle, Clock, Square, Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { problemsService } from '@/services/problems.service';
import { patternsService } from '@/services/patterns.service';
import { submissionsService } from '@/services/submissions.service';

const diffClass = {
  easy: 'bg-success/20 text-success',
  medium: 'bg-warning/20 text-warning',
  hard: 'bg-destructive/20 text-destructive',
};
const statusIcon = {
  solved: <CheckCircle size={16} className="text-success" />,
  pending: <Clock size={16} className="text-warning" />,
  unsolved: <Square size={14} className="text-muted-foreground" />,
};
const platformClass: Record<string, string> = {
  LeetCode: 'bg-warning/20 text-warning',
  GeeksforGeeks: 'bg-success/20 text-success',
  Other: 'bg-muted text-muted-foreground',
};
const platformLabel: Record<string, string> = { LeetCode: 'LC', GeeksforGeeks: 'GFG', Other: 'Other' };

export default function Problems() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const patternId = params.get('pattern');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [submitModal, setSubmitModal] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const { data: allPatterns = [] } = useQuery({
    queryKey: ['patterns'],
    queryFn: () => patternsService.getAll(),
  });

  const { data: problems = [], isLoading } = useQuery({
    queryKey: ['problems', patternId],
    queryFn: () => problemsService.getAll(patternId ? { pattern_id: patternId } : undefined),
  });

  const pattern = allPatterns.find((p: any) => p.id === patternId);
  const modalProblem = problems.find((p: any) => p.id === submitModal);

  const handleSubmit = async () => {
    if (!modalProblem || !screenshot) {
      toast.error('Please upload a screenshot');
      return;
    }
    setSubmitting(true);
    try {
      await submissionsService.create(modalProblem.id, screenshot, notes || undefined);
      toast.success('Submission sent for review!');
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      setSubmitModal(null);
      setScreenshot(null);
      setNotes('');
    } catch (err: any) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout title={pattern?.name || 'Problems'}>
      <PageWrapper title="Problems">
        <div className="space-y-6">
          {patternId && (
            <button onClick={() => navigate('/patterns')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={16} /> Patterns
            </button>
          )}

          {pattern && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">{pattern.name}</h2>
              <p className="text-muted-foreground text-sm mt-1">{pattern.description}</p>
              <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                <span>{problems.length} problems</span>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block glass-card rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs">
                      <th className="px-4 py-3 text-left w-12">#</th>
                      <th className="px-4 py-3 text-left">Problem</th>
                      <th className="px-4 py-3 text-left">Platform</th>
                      <th className="px-4 py-3 text-left">Difficulty</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map((p: any, i: number) => (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-foreground hover:text-primary cursor-pointer transition-colors">{p.title}</td>
                        <td className="px-4 py-3">
                          <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', platformClass[p.platform] || platformClass.Other)}>
                            {platformLabel[p.platform] || p.platform}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('text-[10px] px-2 py-0.5 rounded-full capitalize', diffClass[p.difficulty as keyof typeof diffClass])}>
                            {p.difficulty}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {p.problem_url && <a href={p.problem_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><ExternalLink size={14} /></a>}
                            {p.reference_video && <a href={p.reference_video} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Video size={14} /></a>}
                            {p.solution_video && <a href={p.solution_video} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><MonitorPlay size={14} /></a>}
                            <button
                              onClick={() => setSubmitModal(p.id)}
                              className="text-[10px] px-2.5 py-1 rounded bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                            >
                              Submit
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {problems.map((p: any) => (
                  <div key={p.id} className="glass-card rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground text-sm">{p.title}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full', platformClass[p.platform] || platformClass.Other)}>{platformLabel[p.platform] || p.platform}</span>
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full capitalize', diffClass[p.difficulty as keyof typeof diffClass])}>{p.difficulty}</span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      {p.problem_url && <a href={p.problem_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><ExternalLink size={14} /></a>}
                      <button onClick={() => setSubmitModal(p.id)} className="ml-auto text-[10px] px-3 py-1 rounded bg-primary text-primary-foreground font-medium">Submit</button>
                    </div>
                  </div>
                ))}
              </div>

              {problems.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No problems found. {patternId ? 'Try a different pattern.' : ''}
                </div>
              )}
            </>
          )}
        </div>

        {/* Submit modal */}
        <AnimatePresence>
          {submitModal && modalProblem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-background/80 backdrop-blur-sm p-4"
              onClick={() => setSubmitModal(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="glass-card rounded-xl p-6 w-full max-w-md"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="font-heading font-bold text-foreground text-lg mb-1">Submit Solution</h3>
                <p className="text-sm text-muted-foreground mb-4">{modalProblem.title}</p>

                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) setScreenshot(e.dataTransfer.files[0]); }}
                  onClick={() => document.getElementById('file-input')?.click()}
                  className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                    dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  )}
                >
                  {screenshot ? (
                    <p className="text-sm text-foreground">{screenshot.name}</p>
                  ) : (
                    <>
                      <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Drop your screenshot here or click to upload</p>
                    </>
                  )}
                  <input id="file-input" type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) setScreenshot(e.target.files[0]); }} />
                </div>

                <textarea
                  placeholder="Add any notes (optional)..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full mt-4 p-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />

                <div className="flex gap-3 mt-4">
                  <button onClick={() => setSubmitModal(null)} className="flex-1 py-2.5 rounded-lg border border-border text-muted-foreground text-sm hover:text-foreground transition-colors">Cancel</button>
                  <button onClick={handleSubmit} disabled={submitting}
                    className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-semibold hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    {submitting ? 'Submitting...' : 'Submit Solution →'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </PageWrapper>
    </AppLayout>
  );
}
