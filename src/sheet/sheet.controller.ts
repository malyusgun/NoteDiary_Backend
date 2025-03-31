import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { SheetService } from './sheet.service';
import { EditSheetBackgroundDTO, SheetDTO } from './dto/sheet.dto';
import ApiError from '../exceptions/ApiError';

@Controller('sheets')
export class SheetController {
  constructor(private sheetService: SheetService) {}

  @Post()
  async createSheet(@Body() dto: SheetDTO) {
    try {
      return await this.sheetService.createSheet(dto);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Get(':uuid/background')
  async getSheetBackground(@Body() sheet_uuid: string) {
    try {
      const sheetUuid = sheet_uuid.split('/')[2];
      return await this.sheetService.getSheetBackground(sheetUuid);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Patch(':uuid')
  async editSheet(@Body() dto: SheetDTO) {
    try {
      return await this.sheetService.editSheet(dto);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Patch(':uuid/background')
  async editSheetBackground(@Body() dto: EditSheetBackgroundDTO) {
    try {
      return await this.sheetService.editSheetBackground(dto);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Delete(':uuid')
  async deleteSheet(@Body() dto: SheetDTO) {
    try {
      return await this.sheetService.deleteSheet(dto);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Delete(':uuid/background')
  async deleteSheetBackground(@Body() sheet_uuid: string) {
    try {
      return await this.sheetService.deleteSheetBackground(sheet_uuid);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }
}
