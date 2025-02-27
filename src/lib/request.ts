// src/utils/request.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { toast } from "sonner";

// 定义响应数据接口
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 请求配置接口
interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean; // 是否跳过错误处理
  showSuccessMessage?: boolean; // 是否显示成功提示
}

// 错误信息接口
interface ErrorResponse {
  message: string;
  code?: number;
  [key: string]: any;
}

class RequestService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: "http://47.120.14.30:8080/api/v1",
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { data, config } = response;
        const requestConfig = config as RequestConfig;

        if (data.code === 200) {
          return data.data;
        } else if (data.code === 302) {
        } else {
          if (!requestConfig.skipErrorHandler) {
            toast.error(data.message || "请求失败");
          }
          return Promise.reject(new Error(data.message || "请求失败"));
        }
      },
      (error: AxiosError<ErrorResponse>) => {
        const requestConfig = error.config as RequestConfig;
        if (!requestConfig.skipErrorHandler) {
          const errorMessage =
            error.response?.data?.message || error.message || "服务器错误";
          toast.error(errorMessage);
        }
        return Promise.reject(error);
      }
    );
  }

  // 通用请求方法
  private async request<T = any>(config: RequestConfig): Promise<T> {
    try {
      return await this.instance.request(config);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // GET 请求
  public async get<T = any>(
    url: string,
    params?: any,
    config: Omit<RequestConfig, "params"> = {}
  ): Promise<T> {
    return this.request<T>({ ...config, method: "get", url, params });
  }

  // POST 请求
  public async post<T = any>(
    url: string,
    data?: any,
    config: Omit<RequestConfig, "data"> = {}
  ): Promise<T> {
    return this.request<T>({ ...config, method: "post", url, data });
  }

  // PUT 请求
  public async put<T = any>(
    url: string,
    data?: any,
    config: Omit<RequestConfig, "data"> = {}
  ): Promise<T> {
    return this.request<T>({ ...config, method: "put", url, data });
  }

  // DELETE 请求
  public async delete<T = any>(
    url: string,
    params?: any,
    config: Omit<RequestConfig, "params"> = {}
  ): Promise<T> {
    return this.request<T>({ ...config, method: "delete", url, params });
  }
}

// 导出请求实例
export const request = new RequestService();
