<div align="center">
  <img src="ai-code-checker.png" alt="LOGO" width="100">
</div>

<br/>

An AI-powered VSCode extension that checks code quality and displays colorful scores in the status bar.

一个 VSCode 扩展，使用 AI 检查代码质量并在状态栏显示彩色分数。

---

## ✨ 功能

- 彩色分数显示（红色 → 橙色 → 黄色 → 蓝色 → 绿色）
- AI集成（本地 Ollama 或远程 API）
- 自动更新分数（支持配置防抖时间）
- 快捷键（Ctrl+Alt+E / Cmd+Alt+E）
- 可配置的系统提示词

## 📊 分数等级

| 分数范围 | 等级 |
|---------|------|
| 90-100 | 优秀 |
| 80-89 | 良好 |
| 70-79 | 一般 |
| 60-69 | 较差 |
| 0-59 | 严重 |

## 🚀 快速开始

### 安装

#### 方式一：从 VSCode 市场安装（推荐）

1. 在 VSCode 中打开扩展视图（Ctrl+Shift+X / Cmd+Shift+X）
2. 搜索 "Code Checker"
3. 点击安装

#### 方式二：从发行版安装

1. 从 [GitHub Releases](https://github.com/MRoldL001/AI-Code-Checker/releases) 下载 `.vsix` 文件
2. 在 VSCode 中执行：`Extensions: Install from VSIX...`
3. 选择下载的 `.vsix` 文件

### 配置 AI

#### 本地模型（推荐）

1. 安装 [Ollama](https://ollama.ai/)
2. 下载模型：`ollama pull llama2`（或你喜欢的其他模型）
3. 启动 Ollama：`ollama serve`
4. 设置 `codeChecker.aiProvider` 为 `local`
5. 设置 `codeChecker.local.model` 为你的模型名称

#### 远程 API

设置 `codeChecker.aiProvider` 为 `remote`，配置 API 地址、密钥和模型名称。

### 使用

打开代码文件，插件自动检查并在状态栏显示分数，或按 `Ctrl+Alt+E` / `Cmd+Alt+E` 手动触发。

## ⚙️ 配置

| 设置 | 描述 | 默认值 |
|------|------|--------|
| `codeChecker.aiProvider` | AI 服务提供商（local=本地, remote=远程） | `local` |
| `codeChecker.local.model` | 本地 Ollama 模型名称 | `llama2` |
| `codeChecker.remote.endpoint` | 远程 API 地址 | - |
| `codeChecker.remote.apiKey` | 远程 API 密钥（可选） | - |
| `codeChecker.remote.model` | 远程 API 模型名称 | - |
| `codeChecker.autoUpdate` | 启用自动更新 | `true` |
| `codeChecker.updateDebounceMs` | 防抖时间（毫秒） | `2000` |
| `codeChecker.statusBarPosition` | 状态栏位置 | `right` |

## 🛠️ 开发者 API

| 函数 | 描述 |
|------|------|
| `getCurrentScore()` | 获取当前分数（0-100，未检查则为-1） |
| `getScoreColor(score)` | 根据分数获取 hex 颜色值 |
| `getScoreLabel(score)` | 根据分数获取等级 |
