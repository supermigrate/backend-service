import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LaunchboxService } from './launchbox.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomUploadFileTypeValidator } from '../../common/validators/file.validator';
import { env } from '../../common/config/env';
import { CreateDto } from './dtos/launchbox.dto';
import { FileMimes } from '../../common/enums/index.enum';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('launchbox')
export class LaunchboxController {
  constructor(private readonly launchboxService: LaunchboxService) {}

  @UseInterceptors(FileInterceptor('logo'))
  @Post('/tokens')
  async create(
    @Body() createDto: CreateDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: env.file.maxSize * 1000 * 1024,
          }),
          new CustomUploadFileTypeValidator({
            fileType: [
              FileMimes.PNG,
              FileMimes.JPEG,
              FileMimes.JPG,
              FileMimes.SVG,
            ],
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.launchboxService.create(createDto, file);
  }

  @Get('/tokens')
  async findAll() {
    return this.launchboxService.findAll();
  }

  @Get('/tokens/:id')
  async findOne(@Param('id') id: string) {
    return this.launchboxService.findOne(id);
  }
}
