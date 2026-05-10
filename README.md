# 代码检查器

一个VSCode扩展，使用AI检查代码质量并在状态栏显示多彩分数。

## 功能

- 🎨 **彩色分数显示（红色 → 橙色 → 黄色 → 黄绿色 → 绿色）**
- 🤖 **AI集成（本地模型、OpenAI或自定义API）**
- ⚡ **自动更新（支持配置防抖时间）**
- ⌨️ **快捷键（Ctrl+Shift+C / Cmd+Shift+C）**
- 📊 **可配置的系统提示词**
- 📍 **状态栏位置（左侧或右侧）**

## 分数颜色

| 分数范围 | 颜色 | 等级 |
|---------|------|------|
| 90-100 | 🟢 绿色 | 优秀 |
| 80-89 | 🟢 黄绿色 | 良好 |
| 70-79 | 🟡 黄色 | 一般 |
| 60-69 | 🟠 橙色 | 较差 |
| 0-59 | 🔴 红色 | 严重 |

## 自动更新逻辑

自动更新功能使用**防抖机制**：

1. 编辑代码时，插件会等待配置的时间（默认2000毫秒）。
2. 如果在这段时间内停止输入，就会触发代码质量检查。
3. 这样可以避免在积极输入时产生过多的API调用。
4. 可以在设置中完全禁用自动更新或更改防抖时间。

## 开发者API

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

## 配置

| 设置 | 描述 | 默认值 |
|------|------|--------|
| `codeChecker.aiProvider` | AI服务提供商（local, openai, custom） | `local` |
| `codeChecker.openai.apiKey` | OpenAI API密钥 | `""` |
| `codeChecker.openai.model` | OpenAI模型 | `gpt-4-turbo` |
| `codeChecker.custom.endpoint` | 自定义API地址 | `""` |
| `codeChecker.custom.apiKey` | 自定义API密钥 | `""` |
| `codeChecker.custom.model` | 自定义模型名称 | `""` |
| `codeChecker.autoUpdate` | 启用自动更新 | `true` |
| `codeChecker.updateDebounceMs` | 自动更新的防抖时间 | `2000` |
| `codeChecker.statusBarPosition` | 状态栏位置（left/right） | `right` |
| `codeChecker.systemPrompt` | AI的系统提示词 | 见下文 |

### 默认系统提示词

```
"You are a code quality checker. Your task is to evaluate the given code and return only a number between 0 and 100 representing the code quality score, where 0 is very poor and 100 is excellent. Do NOT include any other text or explanation in your response."
```

## 快速开始

1. 安装扩展
2. 在VSCode设置中配置AI服务提供商
3. 打开代码文件
4. 插件会自动检查代码质量！

## 命令

- **代码检查器：检查代码质量** - 手动触发代码质量检查（Ctrl+Shift+C / Cmd+Shift+C）

## 配置本地模型（Ollama）

1. 安装 [Ollama](https://ollama.ai/)
2. 下载模型：`ollama pull llama2`
3. 启动Ollama：`ollama serve`
4. 将 `codeChecker.aiProvider` 设置为 `local`

## 许可证

MIT
