import * as vscode from 'vscode';
import { AIService, getConfigFromVSCode } from './aiService';
import { getScoreLabel, getScoreColor } from './scoreSystem';

let aiService: AIService | undefined;
let statusBarItem: vscode.StatusBarItem | undefined;
let debounceTimer: NodeJS.Timeout | null = null;
let currentScore: number = -1;

function createStatusBarItem(context: vscode.ExtensionContext): vscode.StatusBarItem {
  if (statusBarItem) {
    statusBarItem.dispose();
  }

  const config = vscode.workspace.getConfiguration('codeChecker');
  const position = config.get<'left' | 'right'>('statusBarPosition', 'right');
  const alignment = position === 'left' ? vscode.StatusBarAlignment.Left : vscode.StatusBarAlignment.Right;

  statusBarItem = vscode.window.createStatusBarItem(alignment, 100);
  statusBarItem.command = 'codeChecker.checkCodeQuality';
  statusBarItem.text = '$(code) 检查代码';
  statusBarItem.tooltip = '点击手动检查代码质量';
  statusBarItem.show();

  context.subscriptions.push(statusBarItem);
  return statusBarItem;
}

export function activate(context: vscode.ExtensionContext) {
  console.log('代码检查器已激活！');

  try {
    const config = getConfigFromVSCode();
    aiService = new AIService(config);

    createStatusBarItem(context);

    const checkCommand = vscode.commands.registerCommand('codeChecker.checkCodeQuality', async () => {
      await checkCodeQuality();
    });

    context.subscriptions.push(checkCommand);

    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('codeChecker.statusBarPosition')) {
        createStatusBarItem(context);
        updateStatusBarItem(currentScore >= 0 ? currentScore : undefined);
      }
    });

    const editor = vscode.window.activeTextEditor;
    if (editor) {
      checkCodeQuality();
    }

    vscode.window.onDidChangeActiveTextEditor(() => {
      checkCodeQuality();
    });

    vscode.workspace.onDidChangeTextDocument(() => {
      debounceCheckCodeQuality();
    });

    context.subscriptions.push(checkCommand);

    if (statusBarItem) {
      context.subscriptions.push(statusBarItem);
    }

  } catch (error) {
    console.error('扩展激活错误:', error);
    vscode.window.showErrorMessage(`代码检查器激活失败: ${error}`);
  }
}

function debounceCheckCodeQuality() {
  const config = vscode.workspace.getConfiguration('codeChecker');
  const autoUpdate = config.get<boolean>('autoUpdate', true);

  if (!autoUpdate || !statusBarItem) {
    return;
  }

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  const debounceMs = config.get<number>('updateDebounceMs', 2000);
  debounceTimer = setTimeout(() => {
    checkCodeQuality();
  }, debounceMs);
}

async function checkCodeQuality() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || !statusBarItem) {
    return;
  }

  statusBarItem.text = '$(sync~spin) 检查中...';
  statusBarItem.color = new vscode.ThemeColor('statusBar.foreground');

  const code = editor.document.getText();

  try {
    if (!aiService) {
      aiService = new AIService(getConfigFromVSCode());
    }

    const score = await aiService.checkCodeQuality(code);

    if (score >= 0) {
      currentScore = score;
      updateStatusBarItem(score);
    }
  } catch (error) {
    console.error('代码质量检查错误:', error);
    if (statusBarItem) {
      statusBarItem.text = '$(error) 检查失败';
      statusBarItem.color = new vscode.ThemeColor('statusBar.foreground');
    }
  }
}

function updateStatusBarItem(score?: number) {
  if (!statusBarItem) {
    return;
  }

  if (score === undefined || score < 0) {
    statusBarItem.text = '$(code) 检查代码';
    statusBarItem.color = new vscode.ThemeColor('statusBar.foreground');
    return;
  }

  const label = getScoreLabel(score);
  statusBarItem.text = `$(code) ${score} ${label}`;
  statusBarItem.color = getScoreColor(score);
}

export function getCurrentScore(): number {
  return currentScore;
}

export function deactivate() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
}
