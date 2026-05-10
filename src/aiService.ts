import * as vscode from 'vscode';
import axios from 'axios';

export interface AIConfig {
  provider: 'local' | 'remote';
  systemPrompt: string;
  remote?: {
    endpoint: string;
    apiKey: string;
    model: string;
  };
}

export class AIService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  public updateConfig(config: AIConfig) {
    this.config = config;
  }

  public async checkCodeQuality(code: string): Promise<number> {
    try {
      switch (this.config.provider) {
        case 'remote':
          return await this.callRemoteAPI(code);
        case 'local':
        default:
          return await this.callLocalModel(code);
      }
    } catch (error) {
      console.error('AI service error:', error);
      vscode.window.showErrorMessage(`代码质量检查失败: ${(error as Error).message}`);
      return -1;
    }
  }

  private async callRemoteAPI(code: string): Promise<number> {
    if (!this.config.remote?.endpoint) {
      throw new Error('未配置远程API地址');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.config.remote.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.remote.apiKey}`;
    }

    const response = await axios.post(
      this.config.remote.endpoint,
      {
        model: this.config.remote.model,
        messages: [
          {
            role: 'system',
            content: this.config.systemPrompt
          },
          {
            role: 'user',
            content: `请评估以下代码的质量:\n\n${code}`
          }
        ],
        temperature: 0.3
      },
      { headers }
    );

    const content = response.data.choices?.[0]?.message?.content || response.data.content || response.data;
    return this.parseScore(content);
  }

  private async callLocalModel(code: string): Promise<number> {
    try {
      const response = await axios.post(
        'http://localhost:11434/api/chat',
        {
          model: 'llama2',
          messages: [
            {
              role: 'system',
              content: this.config.systemPrompt
            },
            {
              role: 'user',
              content: `请评估以下代码的质量:\n\n${code}`
            }
          ],
          stream: false
        },
        {
          timeout: 30000
        }
      );

      const content = response.data.message?.content;
      return this.parseScore(content);
    } catch (error) {
      throw new Error('本地模型不可用。请检查Ollama是否在 http://localhost:11434 上运行');
    }
  }

  private parseScore(content: string): number {
    if (!content) {
      throw new Error('AI返回了空响应');
    }

    const match = content.match(/\b(\d{1,3})\b/);
    if (match) {
      const score = parseInt(match[1], 10);
      if (score >= 0 && score <= 100) {
        return score;
      }
    }

    throw new Error('无法从AI响应中解析分数');
  }
}

export function getConfigFromVSCode(): AIConfig {
  const config = vscode.workspace.getConfiguration('codeChecker');
  return {
    provider: config.get<'local' | 'remote'>('aiProvider', 'local'),
    systemPrompt: config.get<string>('systemPrompt', ''),
    remote: {
      endpoint: config.get<string>('remote.endpoint', ''),
      apiKey: config.get<string>('remote.apiKey', ''),
      model: config.get<string>('remote.model', '')
    }
  };
}
