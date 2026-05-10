An AI-powered VSCode extension that checks code quality and displays colorful scores in the status bar.

一个 VSCode 扩展，使用 AI 检查代码质量并在状态栏显示彩色分数。

---

## 功能

- 彩色分数显示（红色 → 橙色 → 黄色 → 黄绿色 → 绿色）
- AI集成（本地模型、OpenAI 或自定义 API）
- 自动更新分数（支持配置防抖时间）
- 快捷键（Ctrl+Alt+E / Cmd+Alt+E）
- 可配置的系统提示词

## 分数等级

| 分数范围 | 颜色 | 等级 |
|---------|------|------|
| 90-100 | 绿色 (#28a745) | 优秀 |
| 80-89 | 黄绿色 (#9acd32) | 良好 |
| 70-79 | 黄色 (#ffc107) | 一般 |
| 60-69 | 橙色 (#fd7e14) | 较差 |
| 0-59 | 红色 (#dc3545) | 严重 |

## 快速开始

### 安装

1. 在 VSCode 中打开扩展视图（Ctrl+Shift+X / Cmd+Shift+X）
2. 搜索 "Code Checker"
3. 点击安装

### 配置 AI

#### 本地模型（推荐）

1. 安装 [Ollama](https://ollama.ai/)
2. 下载模型：`ollama pull llama2`
3. 启动 Ollama：`ollama serve`
4. 设置 `codeChecker.aiProvider` 为 `local`

#### OpenAI

设置 `codeChecker.aiProvider` 为 `openai`，配置 API 密钥和模型。

#### 自定义 API

设置 `codeChecker.aiProvider` 为 `custom`，配置 API 地址和密钥。

### 使用

打开代码文件，插件自动检查并在状态栏显示分数，或按 `Ctrl+Alt+E` / `Cmd+Alt+E` 手动触发。

## 配置

| 设置 | 描述 | 默认值 |
|------|------|--------|
| `codeChecker.aiProvider` | AI 服务提供商 | `local` |
| `codeChecker.openai.apiKey` | OpenAI API 密钥 | - |
| `codeChecker.openai.model` | OpenAI 模型 | `gpt-4-turbo` |
| `codeChecker.custom.endpoint` | 自定义 API 地址 | - |
| `codeChecker.custom.apiKey` | 自定义 API 密钥 | - |
| `codeChecker.autoUpdate` | 启用自动更新 | `true` |
| `codeChecker.updateDebounceMs` | 防抖时间（毫秒） | `2000` |

## 开发者 API

| 函数 | 描述 |
|------|------|
| `getCurrentScore()` | 获取当前分数（0-100，未检查则为-1） |
| `getScoreColor(score)` | 根据分数获取 hex 颜色值 |
| `getScoreLabel(score)` | 根据分数获取等级 |
