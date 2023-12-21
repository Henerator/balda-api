import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { readJson } from 'fs-extra';
import { FindRandomWordDto } from 'src/word/dto/find-random-word.dto';
import { FindWordDto } from 'src/word/dto/find-word.dto';
import { Word } from 'src/word/models/word.model';
import { WordDataService } from '../word-data.service';

@Injectable()
export class FileWordDataService implements WordDataService {
  private readonly filePath = `${path}/file-db/words.json`;

  async getAll(): Promise<Word[]> {
    const words = await this.readWords();
    return words.map((word) => this.createWordModel(word));
  }

  async find(dto: FindWordDto): Promise<Word | null> {
    const words = await this.readWords();
    const foundWord = words.find((searchWord) => searchWord === dto.value);

    if (!foundWord) return null;

    return this.createWordModel(foundWord);
  }

  async findRandom(dto: FindRandomWordDto): Promise<Word> {
    const allWords = await this.readWords();
    const words = allWords.filter((word) => word.length === dto.length);
    const word = words[Math.floor(Math.random() * words.length)];
    return this.createWordModel(word);
  }

  async create(): Promise<Word | null> {
    throw new Error('Not implemented');
  }

  async createMany(): Promise<Word[]> {
    throw new Error('Not implemented');
  }

  async delete(): Promise<Word | null> {
    throw new Error('Not implemented');
  }

  private async readWords(): Promise<string[]> {
    return readJson(this.filePath);
  }

  private createWordModel(value: string): Word {
    const word = new Word();
    word.value = value;
    return word;
  }
}
