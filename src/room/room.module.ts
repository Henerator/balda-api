import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WordModule } from 'src/word/word.module';
import { MongoRoomDataService } from './data/mongo-data/mongo-room-data.service';
import { RoomDataService } from './data/room-data.service';
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
    WordModule,
  ],
  providers: [
    RoomGateway,
    RoomService,
    {
      provide: RoomDataService,
      useClass: MongoRoomDataService,
    },
    // {
    //   provide: RoomDataService,
    //   useClass: FileRoomDataService,
    // },
  ],
  controllers: [RoomController],
})
export class RoomModule {}