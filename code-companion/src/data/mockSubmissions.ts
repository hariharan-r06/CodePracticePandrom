export interface Submission {
  id: string;
  problemTitle: string;
  patternName: string;
  platform: 'LeetCode' | 'GeeksforGeeks' | 'Other';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  screenshotUrl: string;
  notes?: string;
  feedback?: string;
  studentName?: string;
}

export const mockSubmissions: Submission[] = [
  { id: 's1', problemTitle: 'Two Sum II', patternName: 'Two Pointer', platform: 'LeetCode', difficulty: 'easy', status: 'approved', submittedAt: 'Feb 18, 2026', screenshotUrl: 'https://picsum.photos/seed/s1/400/250', studentName: 'Hariharan R' },
  { id: 's2', problemTitle: '3Sum', patternName: 'Two Pointer', platform: 'LeetCode', difficulty: 'medium', status: 'pending', submittedAt: 'Feb 19, 2026', screenshotUrl: 'https://picsum.photos/seed/s2/400/250', studentName: 'Hariharan R' },
  { id: 's3', problemTitle: 'Binary Search', patternName: 'Binary Search', platform: 'LeetCode', difficulty: 'easy', status: 'rejected', submittedAt: 'Feb 17, 2026', screenshotUrl: 'https://picsum.photos/seed/s3/400/250', feedback: 'Screenshot not clear, please resubmit', studentName: 'Hariharan R' },
  { id: 's4', problemTitle: 'Sliding Window Maximum', patternName: 'Sliding Window', platform: 'LeetCode', difficulty: 'hard', status: 'approved', submittedAt: 'Feb 16, 2026', screenshotUrl: 'https://picsum.photos/seed/s4/400/250', studentName: 'Hariharan R' },
  { id: 's5', problemTitle: 'Valid Anagram', patternName: 'Hashing', platform: 'LeetCode', difficulty: 'easy', status: 'pending', submittedAt: 'Feb 19, 2026', screenshotUrl: 'https://picsum.photos/seed/s5/400/250', studentName: 'Hariharan R' },
  { id: 's6', problemTitle: 'Climbing Stairs', patternName: 'Dynamic Programming', platform: 'LeetCode', difficulty: 'easy', status: 'approved', submittedAt: 'Feb 15, 2026', screenshotUrl: 'https://picsum.photos/seed/s6/400/250', studentName: 'Hariharan R' },
  { id: 's7', problemTitle: 'Number of Islands', patternName: 'Graph BFS/DFS', platform: 'LeetCode', difficulty: 'medium', status: 'pending', submittedAt: 'Feb 20, 2026', screenshotUrl: 'https://picsum.photos/seed/s7/400/250', studentName: 'Priya M' },
  { id: 's8', problemTitle: 'Container With Most Water', patternName: 'Two Pointer', platform: 'LeetCode', difficulty: 'medium', status: 'pending', submittedAt: 'Feb 20, 2026', screenshotUrl: 'https://picsum.photos/seed/s8/400/250', studentName: 'Arun K' },
];
