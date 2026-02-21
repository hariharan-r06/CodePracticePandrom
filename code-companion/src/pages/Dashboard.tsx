import React from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useAuth } from '@/context/AuthContext';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Code2, Grid3x3, TrendingUp, Flame, ArrowRight, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { patternsService } from '@/services/patterns.service';
import { profileService } from '@/services/profile.service';
import { submissionsService } from '@/services/submissions.service';

const diffColors = { easy: 'bg-success/20 text-success', medium: 'bg-warning/20 text-warning', hard: 'bg-destructive/20 text-destructive' };

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: patterns = [] } = useQuery({ queryKey: ['patterns'], queryFn: () => patternsService.getAll() });
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: () => profileService.getMyProfile() });
  const { data: stats } = useQuery({ queryKey: ['submission-stats'], queryFn: () => submissionsService.getStats() });

  const totalSolved = stats?.approved || 0;
  const totalProblems = (stats?.total || 0) + 20; // estimate
  const streak = profile?.stats?.streak || user?.streak || 0;
  const patternsCompleted = profile?.stats?.patternsCompleted || 0;
  const completionRate = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;
  const recentSubs = profile?.recentSubmissions || [];

  const barData = [
    { name: 'Easy', solved: recentSubs.filter((s: any) => s.problems?.difficulty === 'easy').length, fill: 'hsl(142,71%,45%)' },
    { name: 'Medium', solved: recentSubs.filter((s: any) => s.problems?.difficulty === 'medium').length, fill: 'hsl(38,92%,50%)' },
    { name: 'Hard', solved: recentSubs.filter((s: any) => s.problems?.difficulty === 'hard').length, fill: 'hsl(0,84%,60%)' },
  ];

  const pieColors = ['hsl(239,84%,67%)', 'hsl(188,95%,43%)', 'hsl(142,71%,45%)', 'hsl(38,92%,50%)', 'hsl(0,84%,60%)'];
  const pieData = patterns.slice(0, 5).map((p: any, i: number) => ({
    name: p.name,
    value: p.problem_count || 0,
    fill: pieColors[i % pieColors.length],
  }));

  const statCards = [
    { label: 'Problems Solved', value: `${totalSolved}`, icon: Code2, color: 'bg-primary/20 text-primary', progress: completionRate },
    { label: 'Patterns Available', value: patterns.length, icon: Grid3x3, color: 'bg-secondary/20 text-secondary' },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: TrendingUp, color: 'bg-success/20 text-success' },
    { label: 'Day Streak', value: <span>{streak} 🔥</span>, icon: Flame, color: 'bg-warning/20 text-warning' },
  ];

  return (
    <AppLayout title="Dashboard">
      <PageWrapper title="Dashboard">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Hello, {user?.name?.split(' ')[0] || 'User'} 👋</h2>
              <p className="text-muted-foreground text-sm mt-1">Here's your coding progress for today.</p>
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card rounded-xl p-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color} mb-3`}><s.icon size={18} /></div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-heading text-xl font-bold text-foreground mt-0.5">{s.value}</p>
                {s.progress !== undefined && (
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.progress}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full rounded-full bg-primary" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-foreground">Problem Patterns</h3>
              <button onClick={() => navigate('/patterns')} className="text-sm text-primary hover:underline flex items-center gap-1">View All <ArrowRight size={14} /></button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {patterns.slice(0, 4).map((p: any, i: number) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="glass-card gradient-border-hover rounded-xl p-5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/problems?pattern=${p.id}`)}>
                  <h4 className="font-heading font-bold text-foreground">{p.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground">{p.problem_count || 0} problems</span>
                    <button className="text-xs text-primary font-medium hover:underline">Explore →</button>
                  </div>
                </motion.div>
              ))}
              {patterns.length === 0 && (
                <div className="col-span-full flex items-center justify-center py-12 text-muted-foreground">
                  <Loader2 size={20} className="animate-spin mr-2" /> Loading patterns...
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-5">
              <h4 className="font-heading font-bold text-foreground mb-4">Solved by Difficulty</h4>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={barData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={60} tick={{ fill: 'hsl(215,16%,47%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(240,18%,7%)', border: '1px solid hsl(240,14%,15%)', borderRadius: 8, color: 'hsl(213,31%,95%)' }} />
                  <Bar dataKey="solved" radius={[0, 4, 4, 0]} barSize={20}>
                    {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card rounded-xl p-5">
              <h4 className="font-heading font-bold text-foreground mb-4">Problems by Pattern</h4>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {pieData.map((entry: any, i: number) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(240,18%,7%)', border: '1px solid hsl(240,14%,15%)', borderRadius: 8, color: 'hsl(213,31%,95%)' }} />
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h4 className="font-heading font-bold text-foreground mb-4">Recent Activity</h4>
            <div className="space-y-3">
              {recentSubs.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No recent activity yet. Start solving problems!</p>}
              {recentSubs.map((a: any, i: number) => (
                <motion.div key={a.id || i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    {a.status === 'approved' ? <CheckCircle size={14} className="text-success" /> : <Clock size={14} className="text-warning" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">Submitted <span className="font-semibold">{a.problems?.title || 'Unknown'}</span></p>
                  </div>
                  {a.problems?.difficulty && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${diffColors[a.problems.difficulty as keyof typeof diffColors] || ''}`}>{a.problems.difficulty}</span>
                  )}
                  <span className="text-xs text-muted-foreground whitespace-nowrap capitalize">{a.status}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </PageWrapper>
    </AppLayout>
  );
}
