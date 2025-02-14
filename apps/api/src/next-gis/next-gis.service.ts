import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import * as FormData from 'form-data';

@Injectable()
export class NextGisService {
    private readonly logger = new Logger(NextGisService.name);
    private readonly nextgisUrl: string;
    private axiosInstance: AxiosInstance;
    private cookieJar: CookieJar;

    constructor(private readonly configService: ConfigService) {
        this.nextgisUrl = this.configService.get<string>('NEXTGIS_URL') || 'https://geois2.orb.ru/api';

        // Инициализируем CookieJar и оборачиваем axios для автоматической работы с куками
        this.cookieJar = new CookieJar();
        this.axiosInstance = wrapper(
            axios.create({
                baseURL: this.nextgisUrl,
                jar: this.cookieJar,
                withCredentials: true,
            }),
        );

        // Интерцептор: если получаем 401, пробуем повторно выполнить вход
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                if (error.response && error.response.status === 401) {
                    this.logger.warn('Получен 401, выполняется повторный вход...');
                    await this.login();
                    return this.axiosInstance.request(error.config as AxiosRequestConfig);
                }
                return Promise.reject(error);
            },
        );
    }

    // Метод авторизации: отправляем логин и пароль, куки сохраняются в cookieJar
    async login(): Promise<void> {
        try {
            const response = await this.axiosInstance.post('/component/auth/login', {
                login: this.configService.get('NEXTGIS_USER'),
                password: this.configService.get('NEXTGIS_PASSWORD'),
            });
            this.logger.log(`Успешная авторизация в GEO API. Ответ: ${JSON.stringify(response.data)}`);
        } catch (error) {
            this.logger.error('Ошибка авторизации в GEO API', error);
            throw error;
        }
    }

    // Проверка наличия куков; если их нет – выполняем вход
    private async ensureAuth(): Promise<void> {
        const cookies = await this.cookieJar.getCookies(this.nextgisUrl);
        if (!cookies || cookies.length === 0) {
            this.logger.log('Куки не обнаружены. Выполняется авторизация...');
            await this.login();
        }
    }

    // Получение записей из слоя (LAYER_ID должен быть равен 8806)
    async getRecords(): Promise<any[]> {
        await this.ensureAuth();
        try {
            const response = await this.axiosInstance.get(`/resource/${this.configService.get('LAYER_ID')}/feature/`);
            this.logger.log(`Получены записи: ${JSON.stringify(response.data)}`);
            return response.data;
        } catch (error) {
            this.logger.error('Ошибка при получении записей', error);
            throw error;
        }
    }

    // Создание новой записи
    async addRecord(data: any): Promise<any> {
        await this.ensureAuth();
        try {
            const response = await this.axiosInstance.post(
                `/resource/${this.configService.get('LAYER_ID')}/feature/`,
                data,
            );
            this.logger.log(`Запись добавлена: ${JSON.stringify(response.data)}`);
            return response.data;
        } catch (error) {
            this.logger.error('Ошибка при добавлении записи', error);
            throw error;
        }
    }

    // Обновление существующей записи
    async updateRecord(id: number, data: any): Promise<any> {
        await this.ensureAuth();
        try {
            const response = await this.axiosInstance.put(
                `/resource/${this.configService.get('LAYER_ID')}/feature/${id}`,
                data,
            );
            this.logger.log(`Запись обновлена: ${JSON.stringify(response.data)}`);
            return response.data;
        } catch (error) {
            this.logger.error('Ошибка при обновлении записи', error);
            throw error;
        }
    }

    // Удаление записи по id
    async deleteRecord(id: number): Promise<void> {
        await this.ensureAuth();
        try {
            await this.axiosInstance.delete(`/resource/${this.configService.get('LAYER_ID')}/feature/${id}`);
            this.logger.log(`Запись с id=${id} удалена`);
        } catch (error) {
            this.logger.error('Ошибка при удалении записи', error);
            throw error;
        }
    }

    // Прикрепление файла к записи (пример)
    async attachFileToRecord(recordId: number, fileId: string): Promise<any> {
        await this.ensureAuth();
        try {
            const response = await this.axiosInstance.post(
                `/resource/${this.configService.get('LAYER_ID')}/feature/${recordId}/attachment/`,
                {
                    name: `file_${fileId}`,
                    size: 100110,
                    mime_type: 'image/jpeg',
                    file_upload: { id: fileId, size: 100110 },
                },
            );
            this.logger.log(`Файл прикреплён к записи ${recordId}: ${JSON.stringify(response.data)}`);
            return response.data;
        } catch (error) {
            this.logger.error('Ошибка при прикреплении файла к записи', error);
            throw error;
        }
    }

    async deleteAttachment(recordId: number, attachmentId: number): Promise<void> {
        await this.ensureAuth();
        try {
            await this.axiosInstance.delete(
                `/resource/${this.configService.get('LAYER_ID')}/feature/${recordId}/attachment/${attachmentId}`,
            );
            this.logger.log(`Вложение ${attachmentId} удалено из записи ${recordId}`);
        } catch (error) {
            this.logger.error('Ошибка при удалении вложения', error);
            throw error;
        }
    }
}
