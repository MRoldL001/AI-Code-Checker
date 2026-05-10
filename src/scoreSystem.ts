/**
 * Code quality score system
 */

export enum ScoreColor {
  RED = 'red',
  ORANGE = 'orange',
  YELLOW = 'yellow',
  YELLOW_GREEN = 'yellowgreen',
  GREEN = 'green'
}

export interface ScoreRange {
  min: number;
  max: number;
  color: ScoreColor;
  label: string;
}

export const SCORE_RANGES: ScoreRange[] = [
  { min: 0, max: 59, color: ScoreColor.RED, label: '严重' },
  { min: 60, max: 69, color: ScoreColor.ORANGE, label: '较差' },
  { min: 70, max: 79, color: ScoreColor.YELLOW, label: '一般' },
  { min: 80, max: 89, color: ScoreColor.YELLOW_GREEN, label: '良好' },
  { min: 90, max: 100, color: ScoreColor.GREEN, label: '优秀' }
];

export function getScoreColor(score: number): ScoreColor {
  const clampedScore = Math.max(0, Math.min(100, score));
  const range = SCORE_RANGES.find(r => clampedScore >= r.min && clampedScore <= r.max);
  return range ? range.color : ScoreColor.RED;
}

export function getScoreLabel(score: number): string {
  const clampedScore = Math.max(0, Math.min(100, score));
  const range = SCORE_RANGES.find(r => clampedScore >= r.min && clampedScore <= r.max);
  return range ? range.label : '严重';
}
