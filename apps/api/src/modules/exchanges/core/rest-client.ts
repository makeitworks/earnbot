import { Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

/**
 * REST API 客户端基类
 * 提供 HTTP 请求的通用功能和处理
 */
export abstract class BaseRestClient {
  protected logger = new Logger(this.constructor.name);
  protected client: AxiosInstance;

  constructor(
    protected baseUrl: string,
    protected apiKey: string,
    protected apiSecret: string,
  ) {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  /**
   * 设置拦截器（用于签名等）
   */
  protected setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        this.logger.error('Request error:', error);
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        this.logger.error('Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      },
    );
  }

  /**
   * GET 请求
   */
  protected async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<T> {
    
    return this.client.get(endpoint, { params });
  }

  /**
   * POST 请求
   */
  protected async post<T = any>(
    endpoint: string,
    data?: Record<string, any>,
    params?: Record<string, any>,
  ): Promise<T> {
    return this.client.post(endpoint, data, { params });
  }

  /**
   * PUT 请求
   */
  protected async put<T = any>(
    endpoint: string,
    data?: Record<string, any>,
    params?: Record<string, any>,
  ): Promise<T> {
    return this.client.put(endpoint, data, { params });
  }

  /**
   * DELETE 请求
   */
  protected async delete<T = any>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<T> {
    return this.client.delete(endpoint, { params });
  }
}
