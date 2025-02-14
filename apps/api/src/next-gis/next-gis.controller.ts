import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Res } from '@nestjs/common';
import { NextGisService } from './next-gis.service';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('next-gis')
export class NextGisController {
    constructor(private readonly nextGisService: NextGisService) {}

    @ApiOperation({ summary: 'Получить все записи' })
    @ApiResponse({
        status: 200,
        description: 'Держи.',
    })
    @Get('all')
    async getAllRecords(): Promise<any[]> {
        return this.nextGisService.getRecords();
    }

    @ApiOperation({ summary: 'Добавить героя' })
    @ApiResponse({
        status: 201,
        description: 'Хорош.',
    })
    @Post()
    async addRecord(@Body() data: any): Promise<any> {
        return this.nextGisService.addRecord(data);
    }

    @Put(':id')
    async updateRecord(@Param('id') id: number, @Body() data: any): Promise<any> {
        return this.nextGisService.updateRecord(id, data);
    }

    @Delete(':id')
    async deleteRecord(@Param('id') id: number): Promise<any> {
        return this.nextGisService.deleteRecord(id);
    }
}
