import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { NextGisService } from './next-gis.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('next-gis')
export class NextGisController {
    constructor(private readonly nextGisService: NextGisService) {}

    @Get('all')
    async getAllRecords() {
        return this.nextGisService.getRecords();
    }

    @Get('municipalities')
    async getMunicipalities() {
        return this.nextGisService.getMunicipalities();
    }

    @ApiOperation({ summary: 'Добавить героя' })
    @ApiResponse({ status: 201, description: 'Хорош.' })
    @Post()
    async addRecord(@Body() data: any): Promise<any> {
        return this.nextGisService.addRecord(data);
    }

    @Get('layer/:layerId')
    async getLayer(@Param('layerId') layerId: number) {
        return this.nextGisService.getLayerData(layerId);
    }

    @Put(':id')
    async updateRecord(@Param('id') id: number, @Body() data: any): Promise<any> {
        return this.nextGisService.updateRecord(id, data);
    }

    @Delete(':id')
    async deleteRecord(@Param('id') id: number): Promise<any> {
        return this.nextGisService.deleteRecord(id);
    }

    @Post('click')
    async handleClick(@Body() clickData: any): Promise<any> {
        return this.nextGisService.handleClick(clickData);
    }
}
