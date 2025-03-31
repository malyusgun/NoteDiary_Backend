import { Controller, Post } from '@nestjs/common';
import ApiError from '../exceptions/ApiError';
import { EntitiesService } from '../entities/entities.service';

@Controller('sheets')
export class BufferController {
  constructor(private entitiesService: EntitiesService) {}

  @Post(':uuid/entities/image')
  createImage(req: Buffer) {
    try {
      return this.entitiesService.createImage(req);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Post(':uuid/entities/crop')
  createImageForCrop(req: Buffer) {
    try {
      return this.entitiesService.createImageForCrop(req);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }
}
