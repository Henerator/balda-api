import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoWordDataService } from './data/mongo-data/mongo-word-data.service';
import { WordDataService } from './data/word-data.service';
import { Word, WordSchema } from './models/word.model';
import { WordController } from './word.controller';
import { WordService } from './word.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Word.name,
        schema: WordSchema,
      },
    ]),
  ],
  providers: [
    WordService,
    {
      provide: WordDataService,
      useClass: MongoWordDataService,
    },
    // {
    //   provide: WordDataService,
    //   useClass: FileWordDataService,
    // },
  ],
  exports: [WordService],
  controllers: [WordController],
})
export class WordModule {}
