import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Crown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { leaderboardService } from '@/services/leaderboard.service';
import { useAuth } from '@/context/AuthContext';

const timeTabs = ['All Time', 'This Week', 'This Month'] as const;
const periodMap: Record<string, 'all' | 'week' | 'month'> = {
  'All Time': 'all',
  'This Week': 'week',
  'This Month': 'month',
};

const avatarColors = [
  'bg-gradient-to-br from-primary to-secondary',
  'bg-gradient-to-br from-success to-primary',
  'bg-gradient-to-br from-warning to-destructive',
  'bg-gradient-to-br from-secondary to-success',
  'bg-gradient-to-br from-destructive to-warning',
];

export default function Leaderboard() {
  const [tab, setTab] = useState<string>('All Time');
  const { user } = useAuth();

  const { data: rawData = [], isLoading } = useQuery({
    queryKey: ['leaderboard', tab],
    queryFn: () => leaderboardService.get(periodMap[tab]),
  });

  const data = rawData.map((e: any, i: number) => ({
    rank: e.rank || i + 1,
    name: e.name || e.full_name || 'Anonymous',
    initials: (e.name || e.full_name || 'U').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2),
    problemsSolved: e.solved_count || e.problems_solved || 0,
    patternsDone: e.patterns_done || 0,
    streak: e.streak || 0,
    score: e.score || 0,
    isCurrentUser: e.id === user?.id,
    color: avatarColors[i % avatarColors.length],
  }));

  const top3 = data.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <AppLayout title="Leaderboard">
      <PageWrapper title="Leaderboard">
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Leaderboard 🏆</h2>
            <p className="text-muted-foreground text-sm mt-1">Top coders this week</p>
          </div>

          <div className="flex gap-2">
            {timeTabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={cn('text-xs font-medium px-4 py-2 rounded-full transition-colors', tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}>
                {t}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Podium */}
              {podiumOrder.length >= 3 && (
                <div className="flex items-end justify-center gap-4 pt-8 pb-4">
                  {podiumOrder.map((p: any, idx: number) => {
                    if (!p) return null;
                    const isFirst = idx === 1;
                    const heights = ['h-28', 'h-36', 'h-24'];
                    const medals = ['🥈', '🥇', '🥉'];
                    return (
                      <motion.div
                        key={p.rank}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15 }}
                        className="flex flex-col items-center"
                      >
                        {isFirst && <Crown size={24} className="text-warning mb-1" />}
                        <div className={cn('w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg font-bold text-primary-foreground', p.color)}>
                          {p.initials}
                        </div>
                        <p className="text-sm font-semibold text-foreground mt-2">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.score} pts</p>
                        <div className={cn('w-20 md:w-28 rounded-t-lg mt-2 flex items-start justify-center pt-2 text-2xl', heights[idx], 'bg-muted/50 border border-border/50')}>
                          {medals[idx]}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Table */}
              <div className="glass-card rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="px-4 py-3 text-left w-16">Rank</th>
                      <th className="px-4 py-3 text-left">Player</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Solved</th>
                      <th className="px-4 py-3 text-left hidden sm:table-cell">Streak</th>
                      <th className="px-4 py-3 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((p: any, i: number) => (
                      <motion.tr
                        key={p.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                          'border-b border-border/50 hover:bg-muted/30 transition-colors',
                          p.isCurrentUser && 'bg-primary/5 border-l-2 border-l-primary'
                        )}
                      >
                        <td className="px-4 py-3">
                          {p.rank <= 3 ? ['🥇', '🥈', '🥉'][p.rank - 1] : <span className="text-muted-foreground">{p.rank}</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground', p.color)}>
                              {p.initials}
                            </div>
                            <span className="font-medium text-foreground">
                              {p.name} {p.isCurrentUser && <span className="text-[10px] text-primary">(You)</span>}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{p.problemsSolved}</td>
                        <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{p.streak}🔥</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">{p.score}</td>
                      </motion.tr>
                    ))}
                    {data.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-muted-foreground">
                          No leaderboard data yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </PageWrapper>
    </AppLayout>
  );
}
