import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateWordDto } from './dto/create-word.dto';
import { FindRandomWordDto } from './dto/find-random-word.dto';
import { FindWordDto } from './dto/find-word.dto';
import { INVALID_UPLOADED_FILE, WORD_EXIST } from './exceptions/errors.const';
import { UploadWords } from './interfaces/upload-words.interface';
import { WordService } from './word.service';

@Controller('word')
export class WordController {
  constructor(private readonly service: WordService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async get() {
    return this.service.getAll();
  }

  @Post('find')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async find(@Body() dto: FindWordDto) {
    return this.service.find(dto);
  }

  @Post('random')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async findRandom(@Body() dto: FindRandomWordDto) {
    return this.service.findRandom(dto);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateWordDto) {
    const findWordDto = new FindWordDto(dto.value);
    const word = await this.service.find(findWordDto);

    if (word) {
      throw new HttpException(WORD_EXIST, HttpStatus.CONFLICT);
    }

    return this.service.create(dto);
  }

  @Post('upload')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'json',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    let parsedJson: UploadWords | null = null;
    try {
      parsedJson = JSON.parse(file.buffer.toString()) as UploadWords;
    } catch {
      throw new HttpException(INVALID_UPLOADED_FILE, HttpStatus.BAD_REQUEST);
    }

    const words = parsedJson.words.map((word) => new CreateWordDto(word));
    return this.service.createMany(words);
  }
}
