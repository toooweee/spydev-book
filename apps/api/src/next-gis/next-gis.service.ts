import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import * as FormData from 'form-data';

import wellknown from 'wellknown';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import buffer from '@turf/buffer';

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

    // Новый метод для обработки клика с карты.
    // Фронтенд должен отправлять данные о клике в виде объекта:
    // Если клик происходит по точке, можно отправить { geom: "POINT(3948446 489723)" }
    // Если же отправляется полигон, то { geom: "POLYGON((...))" }
    // Метод преобразует точку в буфер (полигон) и затем ищет героя, чья точка попадает внутрь.
    async handleClick(clickData: any): Promise<any> {
        this.logger.log(`Получен клик с данными: ${JSON.stringify(clickData)}`);

        if (!clickData.geom) {
            return { message: 'Отсутствует поле geom' };
        }

        // Парсим переданную WKT-строку
        const parsedClick = wellknown.parse(clickData.geom);
        if (!parsedClick) {
            return { message: 'Неверный формат WKT для клика' };
        }

        let clickFeature: GeoJSON.Feature<GeoJSON.Polygon>;
        if (parsedClick.type === 'Point') {
            // Если пришла точка, создаём буфер (полигон) вокруг неё (например, радиус 10 метров)
            const pointFeature: GeoJSON.Feature<GeoJSON.Point> = {
                type: 'Feature',
                geometry: parsedClick as GeoJSON.Point,
                properties: {},
            };
            const buffered = buffer(pointFeature, 10, { units: 'meters' });
            // Предполагается, что буфер возвращает Feature с типом Polygon
            clickFeature = buffered as GeoJSON.Feature<GeoJSON.Polygon>;
        } else if (parsedClick.type === 'Polygon' || parsedClick.type === 'MultiPolygon') {
            // Если пришёл полигон, оборачиваем его в Feature
            clickFeature = {
                type: 'Feature',
                geometry: parsedClick as GeoJSON.Polygon,
                properties: {},
            };
        } else {
            return { message: 'Геометрия клика должна быть точкой или полигоном' };
        }

        // Получаем все записи (героев) из слоя
        const records = await this.getRecords();

        // Ищем героя, у которого геометрия (POINT) попадает в область клика
        const matchingHero = records.find((record) => {
            if (record.geom) {
                const parsedHero = wellknown.parse(record.geom);
                if (parsedHero && parsedHero.type === 'Point') {
                    const heroFeature: GeoJSON.Feature<GeoJSON.Point> = {
                        type: 'Feature',
                        geometry: parsedHero as GeoJSON.Point,
                        properties: {},
                    };
                    return booleanPointInPolygon(heroFeature, clickFeature);
                }
            }
            return false;
        });

        if (matchingHero) {
            this.logger.log(`Найден герой: ${JSON.stringify(matchingHero)}`);
            return { message: 'Герой найден', hero: matchingHero };
        } else {
            this.logger.log('Герой не найден по клику');
            return { message: 'Герой не найден', clickData };
        }
    }
}
