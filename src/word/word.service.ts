import { Injectable } from '@nestjs/common';
import { WordDataService } from './data/word-data.service';
import { CreateWordDto } from './dto/create-word.dto';
import { FindRandomWordDto } from './dto/find-random-word.dto';
import { FindWordDto } from './dto/find-word.dto';
import { Word } from './models/word.model';

@Injectable()
export class WordService {
  constructor(private readonly service: WordDataService) {}

  async getAll(): Promise<Word[]> {
    return this.service.getAll();
  }

  async find(dto: FindWordDto): Promise<Word | null> {
    return this.service.find(dto);
  }

  async findRandom(dto: FindRandomWordDto): Promise<Word> {
    return this.service.findRandom(dto);
  }

  async create(dto: CreateWordDto): Promise<Word> {
    return this.service.create(dto);
  }

  async createMany(dto: CreateWordDto[]): Promise<Word[]> {
    return this.service.createMany(dto);
  }
}
