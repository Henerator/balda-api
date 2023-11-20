import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DateTimeModule } from 'src/date-time/date-time.module';
import { WordModule } from 'src/word/word.module';
import { MongoRoomDataService } from './data/mongo-data/mongo-room-data.service';
import { RoomDataService } from './data/room-data.service';
import { RoomHelper } from './helpers/room.helper';
import { SequenceHelper } from './helpers/sequence.helper';
import { Room, RoomSchema } from './models/room.model';
import { RoomController } from './room.controller';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Room.name,
        schema: RoomSchema,
      },
    ]),

    DateTimeModule,
    WordModule,
  ],
  providers: [
    RoomGateway,
    RoomService,
    RoomHelper,
    SequenceHelper,
    {
      provide: RoomDataService,
      useClass: MongoRoomDataService,
    },
  ],
  controllers: [RoomController],
})
export class RoomModule {}
