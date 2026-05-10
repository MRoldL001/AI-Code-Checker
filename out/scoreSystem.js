"use strict";
/**
 * Code quality score system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCORE_RANGES = void 0;
exports.getScoreColor = getScoreColor;
exports.getScoreLabel = getScoreLabel;
exports.SCORE_RANGES = [
    { min: 0, max: 59, color: '#dc3545', label: '严重' },
    { min: 60, max: 69, color: '#fd7e14', label: '较差' },
    { min: 70, max: 79, color: '#ffc107', label: '一般' },
    { min: 80, max: 89, color: '#9acd32', label: '良好' },
    { min: 90, max: 100, color: '#28a745', label: '优秀' }
];
function getScoreColor(score) {
    const clampedScore = Math.max(0, Math.min(100, score));
    const range = exports.SCORE_RANGES.find(r => clampedScore >= r.min && clampedScore <= r.max);
    return range ? range.color : '#dc3545';
}
function getScoreLabel(score) {
    const clampedScore = Math.max(0, Math.min(100, score));
    const range = exports.SCORE_RANGES.find(r => clampedScore >= r.min && clampedScore <= r.max);
    return range ? range.label : '严重';
}
//# sourceMappingURL=scoreSystem.js.map