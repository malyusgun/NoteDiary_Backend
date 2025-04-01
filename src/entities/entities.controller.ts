import { Controller, Delete, Get, Patch, Post, Req } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import ApiError from '../exceptions/ApiError';
import { EntityDBDTO } from './dto/entities.dto';
import { IChangeEntitiesOrder } from './interfaces/entities.interfaces';
import { Request } from 'express';

@Controller('sheets')
export class EntitiesController {
  constructor(private entitiesService: EntitiesService) {}

  @Post(':uuid/entities')
  async createEntity(dto: EntityDBDTO) {
    try {
      return await this.entitiesService.createEntity(dto);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Get(':uuid/entities')
  async getEntities(@Req() req: Request) {
    try {
      const sheetUuid = req.originalUrl.split('/')[2];
      return await this.entitiesService.getEntities(sheetUuid);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Patch(':uuid/entities')
  async editEntity(dto: EntityDBDTO) {
    try {
      return await this.entitiesService.editEntity(dto);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Patch(':uuid/entities/crop/:uuid')
  async cropImage(dto: EntityDBDTO) {
    try {
      return await this.entitiesService.cropImage(dto);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Patch(':uuid/entities/defaultImageSize/:uuid')
  async returnOriginalSizeImage(dto: EntityDBDTO) {
    try {
      return await this.entitiesService.returnOriginalSizeImage(dto);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Patch(':uuid/entities')
  async changeEntitiesOrder(body: IChangeEntitiesOrder) {
    try {
      return await this.entitiesService.changeEntitiesOrder(body);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Delete(':uuid/entities/:uuid')
  async deleteEntity(dto: EntityDBDTO) {
    try {
      return await this.entitiesService.deleteEntity(dto);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }
}
