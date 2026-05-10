```text
 __  __           _        __ _
 \ \/ /___ _ __ | |_ ___ / _| |_   _
  \  // _ \ '_ \| __/ _ \ |_| __| | | |
  /  \  __/ | | | ||  __/  _| |_  |_| |
 /_/\_\___|_| |_|\__\___|_|  \__| (_) |
```
---
智能代码质量检查工具，AI驱动评分，多彩状态栏显示

一个 VSCode 扩展，使用 AI 检查代码质量并在状态栏显示多彩分数。
---
## 🎨 功能

- 🎨 **彩色分数显示**（红色 → 橙色 → 黄色 → 黄绿色 → 绿色）
- 🤖 **AI集成**（本地模型、OpenAI 或自定义 API）
- ⚡ **自动更新**（支持配置防抖时间）
- ⌨️ **快捷键**（Ctrl+Shift+C / Cmd+Shift+C）
- 📊 **可配置的系统提示词**
- 📍 **状态栏位置**（左侧或右侧）

---

## 🎯 用途

通过 AI 自动评估代码质量分数，并在 VSCode 状态栏以不同颜色直观展示：

| 分数范围 | 颜色 | 等级 |
|---------|------|------|
| 90-100 | 绿色 | 优秀 |
| 80-89 | 黄绿色 | 良好 |
| 70-79 | 黄色 | 一般 |
| 60-69 | 橙色 | 较差 |
| 0-59 | 红色 | 严重 |

---

## 🚀 快速开始

### 📦 安装扩展

1. 在 VSCode 中打开扩展视图（Ctrl+Shift+X / Cmd+Shift+X）
2. 搜索 "Code Checker"
3. 点击安装

或者直接安装已打包的 `.vsix` 文件：
```bash
code --install-extension code-checker-1.0.0.vsix
```

### ⚙️ 配置 AI 服务

根据你的需求选择以下方式之一：

#### 🤖 使用本地模型（推荐）

1. 安装 [Ollama](https://ollama.ai/)
2. 下载模型：`ollama pull llama2`
3. 启动 Ollama：`ollama serve`
4. 在 VSCode 设置中将 `codeChecker.aiProvider` 设置为 `local`

#### 🔑 使用 OpenAI

1. 获取 OpenAI API 密钥
2. 在 VSCode 设置中配置：
   - `codeChecker.aiProvider`: `openai`
   - `codeChecker.openai.apiKey`: 你的 API 密钥
   - `codeChecker.openai.model`: `gpt-4-turbo`（或其他模型）

#### ⚙️ 使用自定义 API

1. 在 VSCode 设置中配置：
   - `codeChecker.aiProvider`: `custom`
   - `codeChecker.custom.endpoint`: API 地址
   - `codeChecker.custom.apiKey`: API 密钥
   - `codeChecker.custom.model`: 模型名称

### 🎮 使用插件

1. 打开任意代码文件
2. 插件会自动检查代码质量并在状态栏显示分数
3. 按 `Ctrl+Alt+C` / `Cmd+Alt+C` 手动触发检查

---

## 📋 配置

| 设置 | 描述 | 默认值 |
|------|------|--------|
| `codeChecker.aiProvider` | AI 服务提供商（local, openai, custom） | `local` |
| `codeChecker.openai.apiKey` | OpenAI API 密钥 | `""` |
| `codeChecker.openai.model` | OpenAI 模型 | `gpt-4-turbo` |
| `codeChecker.custom.endpoint` | 自定义 API 地址 | `""` |
| `codeChecker.custom.apiKey` | 自定义 API 密钥 | `""` |
| `codeChecker.custom.model` | 自定义模型名称 | `""` |
| `codeChecker.autoUpdate` | 启用自动更新 | `true` |
| `codeChecker.updateDebounceMs` | 自动更新的防抖时间 | `2000` |
| `codeChecker.statusBarPosition` | 状态栏位置（left/right） | `right` |
| `codeChecker.systemPrompt` | AI 的系统提示词 | 见下方 |

### 📝 默认系统提示词

```
"You are a code quality checker. Your task is to evaluate the given code and return only a number between 0 and 100 representing the code quality score, where 0 is very poor and 100 is excellent. Do NOT include any other text or explanation in your response."
```

---

## 🔧 开发者 API

此扩展公开了一些函数供其他扩展使用：

```typescript
import { getCurrentScore, getCurrentScoreColor, getCurrentScoreLabel, getCurrentScoreHexColor } from './extension';
import { ScoreColor, getScoreColor, getScoreLabel, getHexColor, SCORE_RANGES } from './scoreSystem';

// 获取当前分数
const score = getCurrentScore(); // 数字 (0-100, 如果还未检查则为-1)

// 获取当前分数颜色枚举
const color = getCurrentScoreColor(); // ScoreColor

// 获取当前分数等级
const label = getCurrentScoreLabel(); // 字符串

// 获取当前分数十六进制颜色
const hexColor = getCurrentScoreHexColor(); // 字符串 (例如 "#ff4444")

// 也可以直接使用分数系统函数
import { getScoreColor, getScoreLabel, getHexColor } from './scoreSystem';
const color = getScoreColor(85); // ScoreColor.YELLOW_GREEN
const label = getScoreLabel(85); // "良好"
const hex = getHexColor(ScoreColor.GREEN); // "#00cc00"
```

---

## 💻 构建发行版

### 构建命令

```bash
# 安装依赖
npm install

# 编译 TypeScript
npm run compile

# 打包扩展
npm install -g @vscode/vsce
vsce package
```

打包完成后，`.vsix` 文件将出现在项目根目录，可以上传到 VSCode Marketplace 或直接分发给用户。

### 发布到 VSCode Marketplace

1. 安装 vsce：`npm install -g @vscode/vsce`
2. 创建发布令牌：在 [Azure DevOps](https://aka.ms/vscode-create-publisher) 创建发布者
3. 登录：`vsce login <publisher>`
4. 发布：`vsce publish`

---

## ❓ 你是否应该构建发行版

在发布此扩展到 VSCode Marketplace 之前，请考虑以下因素：

### ✅ 建议构建发行版的情况

- 你希望其他开发者能够方便地安装和使用你的插件
- 你已经完成了主要功能的开发和测试
- 你希望获得用户反馈来改进插件
- 你希望向更广泛的受众分享你的工作

### ❌ 不建议立即构建发行版的情况

- 插件仍在快速迭代中，API 可能发生变化
- 核心功能尚未稳定，存在较多已知问题
- 还没有进行充分的测试
- 你正在进行大规模重构

### 📋 构建发行版的前提条件

在发布之前，请确保：

1. **功能完整**：所有承诺的功能都已实现并正常工作
2. **代码质量**：代码已经过审查，没有明显的 bug
3. **测试覆盖**：关键功能已通过测试
4. **文档完善**：用户能够理解如何使用你的插件
5. **图标准备**：为插件创建了专业的图标

---

## ⌨️ 命令

- **代码检查器：检查代码质量** - 手动触发代码质量检查（Ctrl+Alt+C / Cmd+Alt+C）

---

## 📄 许可证

MIT
