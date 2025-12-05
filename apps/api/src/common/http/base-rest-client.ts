import { Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

/**
 * REST API 客户端基类
 * 提供 HTTP 请求的通用功能和处理
 * API Key 和 Secret 可选，仅在需要签名的请求时使用
 */
export abstract class BaseRestClient {
  protected logger = new Logger(this.constructor.name);
  protected client: AxiosInstance;
  
  constructor(protected baseUrl: string) {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });
  }

  /**
   * GET 请求
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<T> {
    const response = await this.client.get(endpoint, { params });
    return response.data as T;
  }

  /**
   * POST 请求
   */
  async post<T = any>(
    endpoint: string,
    data?: Record<string, any>,
    params?: Record<string, any>,
  ): Promise<T> {
    const response = await this.client.post(endpoint, data, { params });
    return response.data as T;
  }

  /**
   * PUT 请求
   */
  protected async put<T = any>(
    endpoint: string,
    data?: Record<string, any>,
    params?: Record<string, any>,
  ): Promise<T> {
    const response = await this.client.put(endpoint, data, { params });
    return response.data as T;
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<T> {
    const response = await this.client.delete(endpoint, { params });
    return response.data as T;
  }
}
