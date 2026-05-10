"use strict";
/**
 * Code quality score system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCORE_RANGES = exports.ScoreColor = void 0;
exports.getScoreColor = getScoreColor;
exports.getScoreLabel = getScoreLabel;
var ScoreColor;
(function (ScoreColor) {
    ScoreColor["RED"] = "red";
    ScoreColor["ORANGE"] = "orange";
    ScoreColor["YELLOW"] = "yellow";
    ScoreColor["YELLOW_GREEN"] = "yellowgreen";
    ScoreColor["GREEN"] = "green";
})(ScoreColor || (exports.ScoreColor = ScoreColor = {}));
exports.SCORE_RANGES = [
    { min: 0, max: 59, color: ScoreColor.RED, label: '严重' },
    { min: 60, max: 69, color: ScoreColor.ORANGE, label: '较差' },
    { min: 70, max: 79, color: ScoreColor.YELLOW, label: '一般' },
    { min: 80, max: 89, color: ScoreColor.YELLOW_GREEN, label: '良好' },
    { min: 90, max: 100, color: ScoreColor.GREEN, label: '优秀' }
];
function getScoreColor(score) {
    const clampedScore = Math.max(0, Math.min(100, score));
    const range = exports.SCORE_RANGES.find(r => clampedScore >= r.min && clampedScore <= r.max);
    return range ? range.color : ScoreColor.RED;
}
function getScoreLabel(score) {
    const clampedScore = Math.max(0, Math.min(100, score));
    const range = exports.SCORE_RANGES.find(r => clampedScore >= r.min && clampedScore <= r.max);
    return range ? range.label : '严重';
}
//# sourceMappingURL=scoreSystem.js.map