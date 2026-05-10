import * as vscode from 'vscode';
import { AIService, getConfigFromVSCode } from './aiService';
import { getScoreLabel } from './scoreSystem';

let aiService: AIService;
let statusBarItem: vscode.StatusBarItem;
let debounceTimer: NodeJS.Timeout | null = null;
let currentScore: number = -1;

export function activate(context: vscode.ExtensionContext) {
  console.log('代码检查器已激活！');

  const config = getConfigFromVSCode();
  aiService = new AIService(config);

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
    const newConfig = getConfigFromVSCode();
    aiService.updateConfig(newConfig);
    if (statusBarItem) {
      statusBarItem.dispose();
    }
    statusBarItem = createStatusBarItem();
    updateStatusBarItem();
  });

  context.subscriptions.push(checkCommand, statusBarItem);
}

function createStatusBarItem(): vscode.StatusBarItem {
  const config = vscode.workspace.getConfiguration('codeChecker');
  const position = config.get<'left' | 'right'>('statusBarPosition', 'right');

  const item = vscode.window.createStatusBarItem(
    position === 'left'
      ? vscode.StatusBarAlignment.Left
      : vscode.StatusBarAlignment.Right,
    100
  );
  item.command = 'codeChecker.checkCodeQuality';
  item.tooltip = '点击手动检查代码质量';
  item.show();
  return item;
}

function debounceCheckCodeQuality() {
  const config = vscode.workspace.getConfiguration('codeChecker');
  const autoUpdate = config.get<boolean>('autoUpdate', true);

  if (!autoUpdate) {
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
  } catch (error) {
    console.error('代码质量检查错误:', error);
    statusBarItem.text = '$(error) 检查失败';
    statusBarItem.color = '#ff6b6b';
  }
}

function updateStatusBarItem(score?: number) {
  if (score === undefined || score < 0) {
    statusBarItem.text = '$(code) 检查代码';
    statusBarItem.color = undefined;
    return;
  }

  const label = getScoreLabel(score);
  statusBarItem.text = `$(code) ${score} ${label}`;

  if (score >= 90) {
    statusBarItem.color = '#4ade80';
  } else if (score >= 80) {
    statusBarItem.color = '#38bdf8';
  } else if (score >= 70) {
    statusBarItem.color = '#facc15';
  } else if (score >= 60) {
    statusBarItem.color = '#fb923c';
  } else {
    statusBarItem.color = '#f87171';
  }
}

export function getCurrentScore(): number {
  return currentScore;
}

export function deactivate() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
}
