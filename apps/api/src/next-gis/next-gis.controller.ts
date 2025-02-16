import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    Patch,
} from '@nestjs/common';
import { NextGisService } from './next-gis.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public, Roles } from '@app/common/decorators';
import { RolesGuard } from '../auth/guards/role.guard';

@ApiBearerAuth()
@Controller('next-gis')
export class NextGisController {
    constructor(private readonly nextGisService: NextGisService) {}

    @Public()
    @Get('all')
    @ApiOperation({ summary: 'Получить все записи' })
    @ApiResponse({ status: 200, description: 'Список записей успешно получен.' })
    async getAllRecords() {
        return this.nextGisService.getRecords();
    }

    @Public()
    @Get('municipalities')
    @ApiOperation({ summary: 'Получить список муниципалитетов' })
    @ApiResponse({ status: 200, description: 'Муниципалитеты успешно получены.' })
    async getMunicipalities() {
        return this.nextGisService.getMunicipalities();
    }

    @Public()
    @ApiOperation({ summary: 'Добавить героя' })
    @ApiResponse({ status: 201, description: 'Запись успешно добавлена.' })
    @Post()
    async addRecord(@Body() data: any): Promise<any> {
        return this.nextGisService.addRecord(data);
    }

    @Public()
    @Get('deceased/:id')
    @ApiOperation({ summary: 'Получить deceased по id' })
    @ApiResponse({ status: 200, description: 'Запись успешно получена.' })
    async getOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.nextGisService.getDeceased(id);
    }

    @Public()
    @Get('layer/:layerId')
    @ApiOperation({ summary: 'Получить данные слоя по id' })
    @ApiResponse({ status: 200, description: 'Данные слоя успешно получены.' })
    async getLayer(@Param('layerId') layerId: number) {
        return this.nextGisService.getLayerData(layerId);
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Put(':id')
    @ApiOperation({ summary: 'Обновить запись' })
    @ApiResponse({ status: 200, description: 'Запись успешно обновлена.' })
    @ApiBody({
        description: 'Объект с данными для обновления записи. Структура тела аналогична запросу на добавление записи.',
        schema: {
            type: 'object',
            properties: {
                extensions: {
                    type: 'object',
                    example: { attachment: null, description: 'Описание записи' },
                },
                fields: {
                    type: 'object',
                    example: {
                        num: 1,
                        n_raion: 'Тюльганский район',
                        fio: 'Сидоров Сидор Сидорович',
                        years: '14.10.1961 – 02.01.1982',
                        info: 'Описание...',
                        kontrakt: 'Боевые действия в Афганистане',
                        nagrads: 'Награжден Орденом Красной Звезды (посмертно)',
                    },
                },
                geom: {
                    type: 'string',
                    example: 'POINT (6266521.594576891 6868838.029030548)',
                },
            },
        },
    })
    async updateRecord(@Param('id', ParseIntPipe) id: number, @Body() data: any): Promise<any> {
        return this.nextGisService.updateRecord(id, data);
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    @ApiOperation({ summary: 'Удалить запись' })
    @ApiResponse({ status: 200, description: 'Запись успешно удалена.' })
    async deleteRecord(@Param('id') id: number): Promise<any> {
        return this.nextGisService.deleteRecord(id);
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Post(':id/attachment')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Прикрепить файл к записи' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Файл для загрузки',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async attachFile(
        @Param('id', ParseIntPipe) id: number,
        // Используем тип any для файла, чтобы избежать ошибки TS2694.
        @UploadedFile() file: any,
    ): Promise<any> {
        return this.nextGisService.attachFileToRecord(id, file);
    }

    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Delete(':id/attachment/:attachmentId')
    @ApiOperation({ summary: 'Удалить прикреплённый файл из записи' })
    @ApiResponse({
        status: 200,
        description: 'Прикреплённый файл успешно удалён.',
    })
    async deleteAttachment(
        @Param('id', ParseIntPipe) id: number,
        @Param('attachmentId', ParseIntPipe) attachmentId: number,
    ): Promise<any> {
        await this.nextGisService.deleteAttachment(id, attachmentId);
        return { message: `Вложение ${attachmentId} удалено из записи ${id}` };
    }
}
