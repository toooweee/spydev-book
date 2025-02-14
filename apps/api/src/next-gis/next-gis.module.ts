import { Module } from '@nestjs/common';
import { NextGisService } from './next-gis.service';
import { NextGisController } from './next-gis.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [HttpModule, ConfigModule],
    controllers: [NextGisController],
    providers: [NextGisService],
})
export class NextGisModule {}
