import { Injectable } from '@nestjs/common';
import { CreateWordDto } from '../dto/create-word.dto';
import { FindRandomWordDto } from '../dto/find-random-word.dto';
import { FindWordDto } from '../dto/find-word.dto';
import { Word } from '../models/word.model';

@Injectable()
export abstract class WordDataService {
  abstract getAll(): Promise<Word[]>;
  abstract find(dto: FindWordDto): Promise<Word | null>;
  abstract findRandom(dto: FindRandomWordDto): Promise<Word>;
  abstract create(dto: CreateWordDto): Promise<Word | null>;
  abstract createMany(dto: CreateWordDto[]): Promise<Word[]>;
}
