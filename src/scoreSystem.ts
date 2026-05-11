export interface ScoreRange {
  min: number;
  max: number;
  color: string;
  label: string;
}

export const SCORE_RANGES: ScoreRange[] = [
  { min: 0, max: 59, color: '#ff3b30', label: '严重' },
  { min: 60, max: 69, color: '#d35400', label: '较差' },
  { min: 70, max: 79, color: '#c9a227', label: '一�?' },
  { min: 80, max: 89, color: '#3794ff', label: '良好' },
  { min: 90, max: 100, color: '#2ea043', label: '优秀' }
];

export function getScoreColor(score: number): string {
  const clampedScore = Math.max(0, Math.min(100, score));
  const range = SCORE_RANGES.find(r => clampedScore >= r.min && clampedScore <= r.max);
  return range!.color;
}

export function getScoreLabel(score: number): string {
  const clampedScore = Math.max(0, Math.min(100, score));
  const range = SCORE_RANGES.find(r => clampedScore >= r.min && clampedScore <= r.max);
  return range!.label;
}
