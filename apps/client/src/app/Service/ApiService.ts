import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
    AxiosHeaders,
    AxiosError, AxiosResponse
} from 'axios';

interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
}

interface ExtendedAxiosResponse<T = any> extends AxiosResponse<T> {
    customData?: T;
    customStatus?: number;
    customStatusText?: string;
}

class ApiService {
    private instance: AxiosInstance;

    constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
            timeout: 10000,
        });

        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = localStorage.getItem('token');
                if (token) {
                    if (!config.headers) {
                        config.headers = new AxiosHeaders();
                    }
                    config.headers.set('Authorization', `Bearer ${token}`);
                }
                return config;
            },
            (error: AxiosError) => Promise.reject(error)
        );

        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                return {
                    ...response,
                    customData: response.data,
                    customStatus: response.status,
                    customStatusText: response.statusText,
                } as ExtendedAxiosResponse;
            },
            (error: AxiosError) => {
                if (axios.isAxiosError(error)) {
                    const { response } = error;
                    if (response && response.status) {
                        switch (response.status) {
                            case 401:
                                console.error('Unauthorized: Пользователь не авторизован');
                                break;
                            case 403:
                                console.error('Forbidden: Доступ запрещен');
                                break;
                            case 404:
                                console.error('Not Found: Ресурс не найден');
                                break;
                            default:
                                if (response.status >= 500) {
                                    console.error('Server Error: Сервер вернул ошибку');
                                }
                        }
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.instance.get<T>(url, config);
        return {
            data: (response as ExtendedAxiosResponse<T>).customData || response.data,
            status: (response as ExtendedAxiosResponse<T>).customStatus || response.status!,
            statusText: (response as ExtendedAxiosResponse<T>).customStatusText || response.statusText!,
        };
    }

    public async post<T, D>(
        url: string,
        data: D,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response = await this.instance.post<T>(url, data, config);
        return {
            data: (response as ExtendedAxiosResponse<T>).customData || response.data,
            status: (response as ExtendedAxiosResponse<T>).customStatus || response.status!,
            statusText: (response as ExtendedAxiosResponse<T>).customStatusText || response.statusText!,
        };
    }

    public async put<T, D>(
        url: string,
        data: D,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response = await this.instance.put<T>(url, data, config);
        return {
            data: (response as ExtendedAxiosResponse<T>).customData || response.data,
            status: (response as ExtendedAxiosResponse<T>).customStatus || response.status!,
            statusText: (response as ExtendedAxiosResponse<T>).customStatusText || response.statusText!,
        };
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.instance.delete<T>(url, config);
        return {
            data: (response as ExtendedAxiosResponse<T>).customData || response.data,
            status: (response as ExtendedAxiosResponse<T>).customStatus || response.status!,
            statusText: (response as ExtendedAxiosResponse<T>).customStatusText || response.statusText!,
        };
    }
}

const apiService = new ApiService('http://localhost:3000/api'); // Замените на ваш URL
export default apiService;
