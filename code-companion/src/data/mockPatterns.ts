export interface Pattern {
  id: string;
  name: string;
  slug: string;
  description: string;
  easy: number;
  medium: number;
  hard: number;
  solvedPercent: number;
  createdAt: string;
}

export const mockPatterns: Pattern[] = [
  { id: '1', name: 'Two Pointer', slug: 'two-pointer', description: 'Master two-pointer techniques for array and string problems', easy: 3, medium: 2, hard: 1, solvedPercent: 40, createdAt: 'Feb 12, 2026' },
  { id: '2', name: 'Sliding Window', slug: 'sliding-window', description: 'Dynamic window-based problem solving', easy: 2, medium: 3, hard: 1, solvedPercent: 20, createdAt: 'Feb 10, 2026' },
  { id: '3', name: 'Binary Search', slug: 'binary-search', description: 'Efficient search patterns and variations', easy: 2, medium: 2, hard: 2, solvedPercent: 60, createdAt: 'Feb 8, 2026' },
  { id: '4', name: 'Dynamic Programming', slug: 'dynamic-programming', description: 'Break problems into optimal subproblems', easy: 1, medium: 3, hard: 2, solvedPercent: 10, createdAt: 'Feb 5, 2026' },
  { id: '5', name: 'Recursion', slug: 'recursion', description: 'Solve problems by breaking them into smaller instances', easy: 3, medium: 2, hard: 1, solvedPercent: 55, createdAt: 'Feb 3, 2026' },
  { id: '6', name: 'Backtracking', slug: 'backtracking', description: 'Explore all potential solutions systematically', easy: 1, medium: 3, hard: 2, solvedPercent: 15, createdAt: 'Jan 28, 2026' },
  { id: '7', name: 'Graph BFS/DFS', slug: 'graph-bfs-dfs', description: 'Traverse and search graph structures', easy: 2, medium: 2, hard: 2, solvedPercent: 30, createdAt: 'Jan 25, 2026' },
  { id: '8', name: 'Greedy', slug: 'greedy', description: 'Make locally optimal choices for global solutions', easy: 2, medium: 3, hard: 1, solvedPercent: 45, createdAt: 'Jan 20, 2026' },
];
