export type Difficulty = 'easy' | 'medium' | 'hard';
export type Platform = 'LeetCode' | 'GeeksforGeeks' | 'Other';
export type ProblemStatus = 'solved' | 'pending' | 'unsolved';

export interface Problem {
  id: string;
  index: number;
  title: string;
  patternSlug: string;
  platform: Platform;
  difficulty: Difficulty;
  status: ProblemStatus;
  problemUrl: string;
  referenceVideo: string;
  solutionVideo: string;
}

export const mockProblems: Problem[] = [
  { id: 'p1', index: 1, title: 'Two Sum II', patternSlug: 'two-pointer', platform: 'LeetCode', difficulty: 'easy', status: 'solved', problemUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p2', index: 2, title: '3Sum', patternSlug: 'two-pointer', platform: 'LeetCode', difficulty: 'medium', status: 'unsolved', problemUrl: 'https://leetcode.com/problems/3sum/', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p3', index: 3, title: 'Container With Most Water', patternSlug: 'two-pointer', platform: 'LeetCode', difficulty: 'medium', status: 'pending', problemUrl: 'https://leetcode.com/problems/container-with-most-water/', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p4', index: 4, title: 'Remove Duplicates', patternSlug: 'two-pointer', platform: 'LeetCode', difficulty: 'easy', status: 'solved', problemUrl: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p5', index: 5, title: 'Trapping Rain Water', patternSlug: 'two-pointer', platform: 'LeetCode', difficulty: 'hard', status: 'unsolved', problemUrl: 'https://leetcode.com/problems/trapping-rain-water/', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p6', index: 1, title: 'Maximum Sum Subarray', patternSlug: 'sliding-window', platform: 'LeetCode', difficulty: 'easy', status: 'solved', problemUrl: 'https://leetcode.com', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p7', index: 2, title: 'Longest Substring Without Repeating', patternSlug: 'sliding-window', platform: 'LeetCode', difficulty: 'medium', status: 'pending', problemUrl: 'https://leetcode.com', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p8', index: 3, title: 'Sliding Window Maximum', patternSlug: 'sliding-window', platform: 'LeetCode', difficulty: 'hard', status: 'unsolved', problemUrl: 'https://leetcode.com', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p9', index: 1, title: 'Binary Search', patternSlug: 'binary-search', platform: 'LeetCode', difficulty: 'easy', status: 'solved', problemUrl: 'https://leetcode.com', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p10', index: 2, title: 'Search in Rotated Array', patternSlug: 'binary-search', platform: 'LeetCode', difficulty: 'medium', status: 'solved', problemUrl: 'https://leetcode.com', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p11', index: 3, title: 'Median of Two Sorted Arrays', patternSlug: 'binary-search', platform: 'LeetCode', difficulty: 'hard', status: 'unsolved', problemUrl: 'https://leetcode.com', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p12', index: 1, title: 'Climbing Stairs', patternSlug: 'dynamic-programming', platform: 'LeetCode', difficulty: 'easy', status: 'solved', problemUrl: 'https://leetcode.com', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p13', index: 2, title: 'Longest Common Subsequence', patternSlug: 'dynamic-programming', platform: 'GeeksforGeeks', difficulty: 'medium', status: 'unsolved', problemUrl: 'https://geeksforgeeks.org', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p14', index: 1, title: 'Fibonacci Number', patternSlug: 'recursion', platform: 'LeetCode', difficulty: 'easy', status: 'solved', problemUrl: 'https://leetcode.com', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p15', index: 2, title: 'Power of Three', patternSlug: 'recursion', platform: 'LeetCode', difficulty: 'easy', status: 'solved', problemUrl: 'https://leetcode.com', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p16', index: 1, title: 'N-Queens', patternSlug: 'backtracking', platform: 'LeetCode', difficulty: 'hard', status: 'unsolved', problemUrl: 'https://leetcode.com', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p17', index: 1, title: 'Number of Islands', patternSlug: 'graph-bfs-dfs', platform: 'LeetCode', difficulty: 'medium', status: 'solved', problemUrl: 'https://leetcode.com', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
  { id: 'p18', index: 1, title: 'Activity Selection', patternSlug: 'greedy', platform: 'GeeksforGeeks', difficulty: 'easy', status: 'solved', problemUrl: 'https://geeksforgeeks.org', referenceVideo: 'https://youtube.com', solutionVideo: 'https://youtube.com' },
];
