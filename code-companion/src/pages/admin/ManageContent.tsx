import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useAuth } from '@/context/AuthContext';
import { Plus, Pencil, Trash2, X, ExternalLink, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import AccessDenied from '../AccessDenied';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patternsService } from '@/services/patterns.service';
import { problemsService } from '@/services/problems.service';
import { submissionsService } from '@/services/submissions.service';

const tabs = ['Patterns', 'Problems', 'Submissions'];
const diffClass: Record<string, string> = { easy: 'bg-success/20 text-success', medium: 'bg-warning/20 text-warning', hard: 'bg-destructive/20 text-destructive' };

export default function ManageContent() {
  const { role } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('Patterns');
  const [drawerOpen, setDrawerOpen] = useState<null | 'pattern' | 'problem'>(null);
  const [patternName, setPatternName] = useState('');
  const [patternDesc, setPatternDesc] = useState('');
  const [probTitle, setProbTitle] = useState('');
  const [probUrl, setProbUrl] = useState('');
  const [probRefVideo, setProbRefVideo] = useState('');
  const [probSolVideo, setProbSolVideo] = useState('');
  const [probPattern, setProbPattern] = useState('');
  const [probPlatform, setProbPlatform] = useState('LeetCode');
  const [probDifficulty, setProbDifficulty] = useState('easy');
  const [subFilter, setSubFilter] = useState('All');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (role !== 'admin') return <AccessDenied />;

  // Data queries
  const { data: patterns = [] } = useQuery({ queryKey: ['patterns'], queryFn: () => patternsService.getAll() });
  const { data: problems = [] } = useQuery({ queryKey: ['problems'], queryFn: () => problemsService.getAll() });
  const { data: submissions = [] } = useQuery({ queryKey: ['all-submissions'], queryFn: () => submissionsService.getMySubmissions() });

  const handleCreatePattern = async () => {
    if (!patternName.trim()) { toast.error('Pattern name is required'); return; }
    try {
      await patternsService.create({ name: patternName, description: patternDesc });
      toast.success('Pattern created!');
      queryClient.invalidateQueries({ queryKey: ['patterns'] });
      setPatternName(''); setPatternDesc(''); setDrawerOpen(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create pattern');
    }
  };

  const handleDeletePattern = async (id: string) => {
    try {
      await patternsService.delete(id);
      toast.success('Pattern deleted');
      queryClient.invalidateQueries({ queryKey: ['patterns'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const handleAddProblem = async () => {
    const errs: Record<string, string> = {};
    if (!probTitle.trim()) errs.title = 'Title required';
    if (!probUrl.trim()) errs.url = 'URL required';
    if (!probPattern) errs.pattern = 'Pattern required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      await problemsService.create({
        title: probTitle,
        pattern_id: probPattern,
        platform: probPlatform,
        difficulty: probDifficulty,
        problem_url: probUrl,
        reference_video: probRefVideo || undefined,
        solution_video: probSolVideo || undefined,
      });
      toast.success('Problem added!');
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      setProbTitle(''); setProbUrl(''); setProbRefVideo(''); setProbSolVideo(''); setErrors({}); setDrawerOpen(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add problem');
    }
  };

  const handleDeleteProblem = async (id: string) => {
    try {
      await problemsService.delete(id);
      toast.success('Problem deleted');
      queryClient.invalidateQueries({ queryKey: ['problems'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const handleApprove = async (s: any) => {
    try {
      await submissionsService.review(s.id, { status: 'approved' });
      toast.success(`Approved successfully`);
      queryClient.invalidateQueries({ queryKey: ['all-submissions'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve');
    }
  };

  const handleReject = async (s: any) => {
    try {
      await submissionsService.review(s.id, { status: 'rejected', feedback: rejectReason || 'Needs revision.' });
      toast.success(`Submission rejected`);
      queryClient.invalidateQueries({ queryKey: ['all-submissions'] });
      setRejectId(null); setRejectReason('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject');
    }
  };

  const filteredSubs = submissions.filter((s: any) => subFilter === 'All' || s.status === subFilter.toLowerCase());

  return (
    <AppLayout title="Manage Content">
      <PageWrapper title="Manage Content">
        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">Manage Content</h2>

          <div className="flex gap-2">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={cn('text-xs font-medium px-4 py-2 rounded-full transition-colors', tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                {t}
              </button>
            ))}
          </div>

          {/* Patterns tab */}
          {tab === 'Patterns' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-semibold text-foreground">Patterns</h3>
                <button onClick={() => setDrawerOpen('pattern')} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5">
                  <Plus size={14} /> New Pattern
                </button>
              </div>
              <div className="glass-card rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Description</th>
                    <th className="px-4 py-3 text-left">Problems</th>
                    <th className="px-4 py-3 text-left hidden sm:table-cell">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr></thead>
                  <tbody>
                    {patterns.map((p: any) => (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell truncate max-w-[200px]">{p.description}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.problem_count || 0}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">{new Date(p.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="text-muted-foreground hover:text-primary transition-colors"><Pencil size={14} /></button>
                            <button onClick={() => handleDeletePattern(p.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Problems tab */}
          {tab === 'Problems' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-semibold text-foreground">Problems</h3>
                <button onClick={() => { setDrawerOpen('problem'); if (patterns.length > 0 && !probPattern) setProbPattern(patterns[0].id); }} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5">
                  <Plus size={14} /> Add Problem
                </button>
              </div>
              <div className="glass-card rounded-xl overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead><tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="px-4 py-3 text-left w-10">#</th>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Pattern</th>
                    <th className="px-4 py-3 text-left">Platform</th>
                    <th className="px-4 py-3 text-left">Difficulty</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr></thead>
                  <tbody>
                    {problems.map((p: any, i: number) => (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{p.title}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{patterns.find((pat: any) => pat.id === p.pattern_id)?.name || '-'}</td>
                        <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{p.platform}</span></td>
                        <td className="px-4 py-3"><span className={cn('text-[10px] px-2 py-0.5 rounded-full capitalize', diffClass[p.difficulty])}>{p.difficulty}</span></td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="text-muted-foreground hover:text-primary transition-colors"><Pencil size={14} /></button>
                            <button onClick={() => handleDeleteProblem(p.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Submissions tab */}
          {tab === 'Submissions' && (
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto">
                {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
                  <button key={f} onClick={() => setSubFilter(f)}
                    className={cn('text-xs font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap',
                      subFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                    {f} {f === 'Pending' && <span className="ml-1 text-[10px]">({submissions.filter((s: any) => s.status === 'pending').length})</span>}
                  </button>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubs.map((s: any) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {(s.profiles?.full_name || 'U').split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.profiles?.full_name || 'Anonymous'}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(s.submitted_at || s.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{s.problems?.title || 'Unknown Problem'}</p>
                    <div className="flex gap-2">
                      {s.problems?.difficulty && <span className={cn('text-[10px] px-2 py-0.5 rounded-full capitalize', diffClass[s.problems.difficulty])}>{s.problems.difficulty}</span>}
                    </div>
                    {s.screenshot_url && (
                      <img src={s.screenshot_url} alt="" onClick={() => setLightbox(s.screenshot_url)}
                        className="w-full h-32 object-cover rounded-lg border border-border cursor-pointer hover:opacity-80 transition-opacity" />
                    )}
                    {s.status === 'pending' && (
                      <div className="space-y-2">
                        {rejectId === s.id ? (
                          <div className="space-y-2">
                            <input placeholder="Rejection reason..." value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                            <div className="flex gap-2">
                              <button onClick={() => setRejectId(null)} className="flex-1 py-1.5 rounded text-xs text-muted-foreground border border-border">Cancel</button>
                              <button onClick={() => handleReject(s)} className="flex-1 py-1.5 rounded text-xs bg-destructive text-destructive-foreground">Confirm Reject</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => handleApprove(s)} className="flex-1 py-2 rounded-lg bg-success/20 text-success text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-success/30 transition-colors">
                              <CheckCircle size={14} /> Approve
                            </button>
                            <button onClick={() => setRejectId(s.id)} className="flex-1 py-2 rounded-lg border border-destructive/30 text-destructive text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-destructive/10 transition-colors">
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {s.status === 'approved' && (
                      <div className="flex items-center gap-2 text-sm text-success"><CheckCircle size={14} /> Approved</div>
                    )}
                    {s.status === 'rejected' && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-destructive"><XCircle size={14} /> Rejected</div>
                        {s.feedback && <p className="text-xs text-destructive/80 mt-1 italic">{s.feedback}</p>}
                      </div>
                    )}
                  </motion.div>
                ))}
                {filteredSubs.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No submissions found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer */}
        <AnimatePresence>
          {drawerOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setDrawerOpen(null)}>
              <motion.div
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border p-6 overflow-y-auto"
                onClick={e => e.stopPropagation()}>

                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading font-bold text-foreground text-lg">
                    {drawerOpen === 'pattern' ? 'Create New Pattern' : 'Add New Problem'}
                  </h3>
                  <button onClick={() => setDrawerOpen(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
                </div>

                {drawerOpen === 'pattern' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Pattern Name</label>
                      <input value={patternName} onChange={e => setPatternName(e.target.value)} placeholder="e.g., Sliding Window"
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                      <textarea value={patternDesc} onChange={e => setPatternDesc(e.target.value)} placeholder="Describe what students will learn..."
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none h-24" />
                    </div>
                    <button onClick={handleCreatePattern}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-sm hover:shadow-glow transition-all">
                      Create Pattern →
                    </button>
                  </div>
                )}

                {drawerOpen === 'problem' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Problem Title *</label>
                      <input value={probTitle} onChange={e => { setProbTitle(e.target.value); setErrors(prev => ({ ...prev, title: '' })); }} placeholder="e.g., Two Sum II"
                        className={cn('w-full px-4 py-3 rounded-lg bg-muted border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm', errors.title ? 'border-destructive' : 'border-border')} />
                      {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Problem URL *</label>
                      <input value={probUrl} onChange={e => { setProbUrl(e.target.value); setErrors(prev => ({ ...prev, url: '' })); }} placeholder="https://leetcode.com/problems/..."
                        className={cn('w-full px-4 py-3 rounded-lg bg-muted border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm', errors.url ? 'border-destructive' : 'border-border')} />
                      {errors.url && <p className="text-xs text-destructive mt-1">{errors.url}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Reference Video</label>
                      <input value={probRefVideo} onChange={e => setProbRefVideo(e.target.value)} placeholder="https://youtube.com/..."
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Our Solution</label>
                      <input value={probSolVideo} onChange={e => setProbSolVideo(e.target.value)} placeholder="https://..."
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Pattern *</label>
                      <select value={probPattern} onChange={e => setProbPattern(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                        {patterns.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Platform</label>
                      <SegmentedControl
                        options={[
                          { label: 'LeetCode', value: 'LeetCode' },
                          { label: 'GeeksforGeeks', value: 'GeeksforGeeks' },
                          { label: 'Other', value: 'Other' },
                        ]}
                        value={probPlatform}
                        onChange={setProbPlatform}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Difficulty</label>
                      <SegmentedControl
                        options={[
                          { label: 'Easy', value: 'easy', activeClass: 'bg-success text-success-foreground shadow-sm' },
                          { label: 'Medium', value: 'medium', activeClass: 'bg-warning text-warning-foreground shadow-sm' },
                          { label: 'Hard', value: 'hard', activeClass: 'bg-destructive text-destructive-foreground shadow-sm' },
                        ]}
                        value={probDifficulty}
                        onChange={setProbDifficulty}
                        className="w-full"
                      />
                    </div>
                    <button onClick={handleAddProblem}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-sm hover:shadow-glow transition-all">
                      Add Problem →
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lightbox */}
        {lightbox && (
          <div className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <img src={lightbox} alt="" className="max-w-full max-h-[80vh] rounded-xl" />
          </div>
        )}
      </PageWrapper>
    </AppLayout>
  );
}
