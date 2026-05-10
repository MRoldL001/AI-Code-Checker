import * as vscode from 'vscode';
import axios from 'axios';

export interface AIConfig {
  provider: 'local' | 'openai' | 'custom';
  systemPrompt: string;
  openai?: {
    apiKey: string;
    model: string;
  };
  custom?: {
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
        case 'openai':
          return await this.callOpenAI(code);
        case 'custom':
          return await this.callCustomAPI(code);
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

  private async callOpenAI(code: string): Promise<number> {
    if (!this.config.openai?.apiKey) {
      throw new Error('未配置OpenAI API密钥');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: this.config.openai.model,
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
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.openai.apiKey}`
        }
      }
    );

    const content = response.data.choices[0].message.content;
    return this.parseScore(content);
  }

  private async callCustomAPI(code: string): Promise<number> {
    if (!this.config.custom?.endpoint) {
      throw new Error('未配置自定义API地址');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.config.custom.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.custom.apiKey}`;
    }

    const response = await axios.post(
      this.config.custom.endpoint,
      {
        model: this.config.custom.model,
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
    provider: config.get<'local' | 'openai' | 'custom'>('aiProvider', 'local'),
    systemPrompt: config.get<string>('systemPrompt', ''),
    openai: {
      apiKey: config.get<string>('openai.apiKey', ''),
      model: config.get<string>('openai.model', 'gpt-4-turbo')
    },
    custom: {
      endpoint: config.get<string>('custom.endpoint', ''),
      apiKey: config.get<string>('custom.apiKey', ''),
      model: config.get<string>('custom.model', '')
    }
  };
}
