export interface LeaderboardEntry {
  rank: number;
  name: string;
  initials: string;
  problemsSolved: number;
  patternsDone: number;
  streak: number;
  score: number;
  isCurrentUser?: boolean;
  color: string;
}

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Arun K', initials: 'AK', problemsSolved: 48, patternsDone: 6, streak: 15, score: 2400, color: 'bg-primary' },
  { rank: 2, name: 'Priya M', initials: 'PM', problemsSolved: 42, patternsDone: 5, streak: 12, score: 2100, color: 'bg-secondary' },
  { rank: 3, name: 'Hariharan R', initials: 'HR', problemsSolved: 38, patternsDone: 4, streak: 7, score: 1900, isCurrentUser: true, color: 'bg-success' },
  { rank: 4, name: 'Deepa S', initials: 'DS', problemsSolved: 35, patternsDone: 4, streak: 9, score: 1750, color: 'bg-warning' },
  { rank: 5, name: 'Karthik V', initials: 'KV', problemsSolved: 30, patternsDone: 3, streak: 5, score: 1500, color: 'bg-primary' },
  { rank: 6, name: 'Sneha R', initials: 'SR', problemsSolved: 28, patternsDone: 3, streak: 4, score: 1400, color: 'bg-secondary' },
  { rank: 7, name: 'Ravi S', initials: 'RS', problemsSolved: 25, patternsDone: 3, streak: 6, score: 1250, color: 'bg-success' },
  { rank: 8, name: 'Anjali P', initials: 'AP', problemsSolved: 22, patternsDone: 2, streak: 3, score: 1100, color: 'bg-warning' },
  { rank: 9, name: 'Vijay M', initials: 'VM', problemsSolved: 18, patternsDone: 2, streak: 2, score: 900, color: 'bg-primary' },
  { rank: 10, name: 'Meera K', initials: 'MK', problemsSolved: 15, patternsDone: 1, streak: 1, score: 750, color: 'bg-secondary' },
];
