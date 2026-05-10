"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.getCurrentScore = getCurrentScore;
exports.deactivate = deactivate;
const vscode = require("vscode");
const aiService_1 = require("./aiService");
const scoreSystem_1 = require("./scoreSystem");
let aiService;
let statusBarItem;
let debounceTimer = null;
let currentScore = -1;
function activate(context) {
    console.log('代码检查器已激活！');
    const config = (0, aiService_1.getConfigFromVSCode)();
    aiService = new aiService_1.AIService(config);
    statusBarItem = createStatusBarItem();
    updateStatusBarItem();
    const checkCommand = vscode.commands.registerCommand('codeChecker.checkCodeQuality', async () => {
        await checkCodeQuality();
    });
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        debounceCheckCodeQuality();
    }
    vscode.window.onDidChangeActiveTextEditor(() => {
        debounceCheckCodeQuality();
    });
    vscode.workspace.onDidChangeTextDocument(() => {
        debounceCheckCodeQuality();
    });
    vscode.workspace.onDidChangeConfiguration(() => {
        const newConfig = (0, aiService_1.getConfigFromVSCode)();
        aiService.updateConfig(newConfig);
        if (statusBarItem) {
            statusBarItem.dispose();
        }
        statusBarItem = createStatusBarItem();
        updateStatusBarItem();
    });
    context.subscriptions.push(checkCommand, statusBarItem);
}
function createStatusBarItem() {
    const config = vscode.workspace.getConfiguration('codeChecker');
    const position = config.get('statusBarPosition', 'right');
    const item = vscode.window.createStatusBarItem(position === 'left'
        ? vscode.StatusBarAlignment.Left
        : vscode.StatusBarAlignment.Right, 100);
    item.command = 'codeChecker.checkCodeQuality';
    item.tooltip = '点击手动检查代码质量';
    item.show();
    return item;
}
function debounceCheckCodeQuality() {
    const config = vscode.workspace.getConfiguration('codeChecker');
    const autoUpdate = config.get('autoUpdate', true);
    if (!autoUpdate) {
        return;
    }
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    const debounceMs = config.get('updateDebounceMs', 2000);
    debounceTimer = setTimeout(() => {
        checkCodeQuality();
    }, debounceMs);
}
async function checkCodeQuality() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    statusBarItem.text = '$(sync~spin) 检查中...';
    statusBarItem.color = undefined;
    const code = editor.document.getText();
    try {
        const score = await aiService.checkCodeQuality(code);
        if (score >= 0) {
            currentScore = score;
            updateStatusBarItem(score);
        }
    }
    catch (error) {
        console.error('代码质量检查错误:', error);
        statusBarItem.text = '$(error) 检查失败';
        statusBarItem.color = new vscode.ThemeColor('statusBarItem.errorForeground');
    }
}
function getStatusBarThemeColor(color) {
    switch (color) {
        case scoreSystem_1.ScoreColor.RED:
            return 'statusBarItem.errorForeground';
        case scoreSystem_1.ScoreColor.ORANGE:
        case scoreSystem_1.ScoreColor.YELLOW:
        case scoreSystem_1.ScoreColor.YELLOW_GREEN:
            return 'statusBarItem.warningForeground';
        case scoreSystem_1.ScoreColor.GREEN:
            return 'statusBarItem.remoteForeground';
        default:
            return 'statusBarItem.foreground';
    }
}
function updateStatusBarItem(score) {
    if (score === undefined || score < 0) {
        statusBarItem.text = '$(code) 检查代码';
        statusBarItem.color = undefined;
        return;
    }
    const color = (0, scoreSystem_1.getScoreColor)(score);
    const label = (0, scoreSystem_1.getScoreLabel)(score);
    statusBarItem.text = `$(code) ${score} ${label}`;
    statusBarItem.color = new vscode.ThemeColor(getStatusBarThemeColor(color));
}
function getCurrentScore() {
    return currentScore;
}
function deactivate() {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
}
//# sourceMappingURL=extension.js.map