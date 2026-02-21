import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { patternsService } from '@/services/patterns.service';

const filters = ['All', 'With Problems', 'New'];

export default function Patterns() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const { data: patterns = [], isLoading } = useQuery({
    queryKey: ['patterns'],
    queryFn: () => patternsService.getAll(),
  });

  const filtered = patterns.filter((p: any) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'With Problems') return (p.problem_count || 0) > 0;
    if (filter === 'New') {
      const created = new Date(p.created_at);
      const week = new Date(Date.now() - 7 * 86400000);
      return created >= week;
    }
    return true;
  });

  return (
    <AppLayout title="Patterns">
      <PageWrapper title="Patterns">
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Algorithm Patterns</h2>
            <p className="text-muted-foreground text-sm mt-1">Master each pattern with curated problems</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search patterns..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'text-xs font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap',
                    filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p: any, i: number) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card gradient-border-hover rounded-xl p-5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/problems?pattern=${p.id}`)}
                >
                  <h4 className="font-heading font-bold text-foreground text-lg">{p.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary">{p.problem_count || 0} problems</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground">Created {new Date(p.created_at).toLocaleDateString()}</span>
                    <button className="text-xs text-primary font-medium hover:underline">Explore →</button>
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No patterns found.
                </div>
              )}
            </div>
          )}
        </div>
      </PageWrapper>
    </AppLayout>
  );
}
