import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWordDto } from 'src/word/dto/create-word.dto';
import { FindRandomWordDto } from 'src/word/dto/find-random-word.dto';
import { FindWordDto } from 'src/word/dto/find-word.dto';
import { Word, WordDocument } from 'src/word/models/word.model';
import { WordDataService } from '../word-data.service';

@Injectable()
export class MongoWordDataService implements WordDataService {
  constructor(@InjectModel(Word.name) private model: Model<WordDocument>) {}

  async getAll(): Promise<Word[]> {
    return this.model.find().exec();
  }

  async find(dto: FindWordDto): Promise<Word | null> {
    return this.model.findOne({ value: dto.value }).exec();
  }

  async findRandom(dto: FindRandomWordDto): Promise<Word> {
    const words = await this.model
      .aggregate([
        {
          $match: {
            $expr: {
              $eq: [{ $strLenCP: '$value' }, dto.length],
            },
          },
        },
        {
          $sample: { size: 1 },
        },
      ])
      .exec();
    return words[0];
  }

  async create(dto: CreateWordDto): Promise<Word | null> {
    return this.model.create(dto);
  }

  async createMany(dto: CreateWordDto[]): Promise<Word[]> {
    return this.model.insertMany(dto, { ordered: false });
  }
}
