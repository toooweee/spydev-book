import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import FormData from 'form-data';
import * as Multer from 'multer';

@Injectable()
export class NextGisService {
    private readonly logger = new Logger(NextGisService.name);
    private readonly nextgisUrl: string;
    private axiosInstance: AxiosInstance;
    private readonly cookieJar: CookieJar;

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

    // Получение записей из слоя (например, LAYER_ID = 8806)
    async getRecords(): Promise<any[]> {
        await this.ensureAuth();
        try {
            const layerId = this.configService.get('LAYER_ID') || 8806; // Убедитесь в правильности ID
            const response = await this.axiosInstance.get(`/resource/${layerId}/geojson`);
            return response.data.features;
        } catch (error) {
            this.logger.error('Ошибка при получении записей', error);
            throw new HttpException('Failed to get records', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getMunicipalities(): Promise<{ layers: number[] }> {
        await this.ensureAuth();
        try {
            const webmapId = '8901';
            const response = await this.axiosInstance.get<{
                webmap: {
                    root_item: {
                        children: Array<{
                            item_type: string;
                            style_parent_id?: number;
                        }>;
                    };
                };
            }>(`/resource/${webmapId}`);

            const layers = response.data.webmap.root_item.children.filter(
                (layer): layer is { item_type: 'layer'; style_parent_id: number } =>
                    layer.item_type === 'layer' && typeof layer.style_parent_id === 'number',
            );

            const layerIds = [...new Set(layers.map((layer) => layer.style_parent_id))];

            this.logger.log(`Найдены слои муниципалитетов: ${layerIds}`);
            return { layers: layerIds };
        } catch (error) {
            this.logger.error('Ошибка при получении границ муниципалитетов', error);
            throw new HttpException('Failed to get municipalities', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getLayerData(layerId: number): Promise<any> {
        await this.ensureAuth();
        try {
            // Прямой запрос к векторному слою
            const response = await this.axiosInstance.get(`/resource/${layerId}/geojson`, {
                params: { srs: 3857 },
            });

            if (!response.data?.features) {
                throw new Error('Некорректный формат GeoJSON');
            }

            // Логируем первый feature для проверки
            this.logger.debug(`Данные слоя ${layerId}:`, response.data.features[0]);

            return response.data;
        } catch (error) {
            this.logger.error(`Ошибка при получении слоя ${layerId}`, error);
            throw new HttpException(`Ошибка загрузки слоя: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getDeceased(id: number) {
        await this.ensureAuth();
        try {
            const response = await this.axiosInstance.get(
                `/resource/${this.configService.get('LAYER_ID')}/feature/${id}`,
            );
            // Явное возвращение всех полей записи
            const { id: recordId, vid, geom, fields, extensions } = response.data;
            return { id: recordId, vid, geom, fields, extensions };
        } catch (e) {
            throw new HttpException(`Failed to get records, ${e}`, HttpStatus.INTERNAL_SERVER_ERROR);
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

    // Прикрепление файла к записи (с использованием FormData и Multer)
    async attachFileToRecord(recordId: number, file: Express.Multer.File): Promise<any> {
        await this.ensureAuth();
        try {
            // Шаг 1. Загрузка файла на сервер
            const uploadFormData = new FormData();
            // Обратите внимание: имя поля должно соответствовать требованиям API (например, 'file')
            uploadFormData.append('file', file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype,
                knownLength: file.size,
            });
            // Также можно передать имя файла, если API это требует
            uploadFormData.append('name', file.originalname);

            const uploadHeaders = uploadFormData.getHeaders();
            const uploadResponse = await this.axiosInstance.post('/component/file_upload/', uploadFormData, {
                headers: uploadHeaders,
            });

            const uploadMeta = uploadResponse.data.upload_meta;
            if (!uploadMeta || uploadMeta.length === 0) {
                throw new Error('Ошибка загрузки файла');
            }
            const uploadedFile = uploadMeta[0]; // Получаем объект файла с id и размером

            // Шаг 2. Прикрепление файла к записи через JSON
            const attachmentBody = {
                name: file.originalname,
                size: file.size,
                mime_type: file.mimetype,
                file_upload: {
                    id: uploadedFile.id,
                    size: file.size,
                },
            };

            const attachResponse = await this.axiosInstance.post(
                `/resource/${this.configService.get('LAYER_ID')}/feature/${recordId}/attachment/`,
                attachmentBody, // Отправляем JSON, axios сам установит Content-Type: application/json
            );
            this.logger.log(`Файл прикреплён к записи ${recordId}: ${JSON.stringify(attachResponse.data)}`);
            return attachResponse.data;
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
