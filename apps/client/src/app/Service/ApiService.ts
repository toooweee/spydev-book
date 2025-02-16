import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosError,
    AxiosResponse,
} from 'axios';

interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
}

// Можно не усложнять и убрать кастомные поля из интерцепторов
// Но если хотите оставить, можно использовать интерфейс ExtendedAxiosResponse
class ApiService {
    private instance: AxiosInstance;

    constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
            timeout: 10000,
        });

        // Интерцептор запросов (добавляет токен, если он есть)
        this.instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers = config.headers ?? {};
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error: AxiosError) => Promise.reject(error),
        );

        // Интерцептор ответов: в случае ошибки делаем логирование
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                // Можно вернуть ответ как есть (или навесить свои поля)
                return response;
            },
            (error: AxiosError) => {
                // Тут можно что-то залогировать, если статус известен
                if (axios.isAxiosError(error) && error.response) {
                    switch (error.response.status) {
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
                            if (error.response.status >= 500) {
                                console.error('Server Error: Сервер вернул ошибку');
                            }
                    }
                }
                // Пробрасываем ошибку дальше, чтобы поймать её в методе (try/catch)
                return Promise.reject(error);
            },
        );
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.instance.get<T>(url, config);
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
            };
        } catch (error) {
            return this.handleError<T>(error);
        }
    }

    public async post<T, D>(url: string, data: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.instance.post<T>(url, data, config);
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
            };
        } catch (error) {
            return this.handleError<T>(error);
        }
    }

    public async put<T, D>(url: string, data: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.instance.put<T>(url, data, config);
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
            };
        } catch (error) {
            return this.handleError<T>(error);
        }
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.instance.delete<T>(url, config);
            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
            };
        } catch (error) {
            return this.handleError<T>(error);
        }
    }

    private handleError<T>(error: unknown): ApiResponse<T> {
        if (axios.isAxiosError(error) && error.response) {
            return {
                data: error.response.data as T,
                status: error.response.status,
                statusText: error.response.statusText || 'Error',
            };
        }
        throw error;
    }
}

const apiService = new ApiService('http://localhost:3000/api');
export default apiService;
