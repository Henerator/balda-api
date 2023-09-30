import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoomDto } from 'src/room/dto/create-room.dto';
import { Room, RoomDocument } from 'src/room/models/room.model';
import { BaseRoomDataService } from '../base-room-data.service';
import { RoomDataService } from '../room-data.service';

@Injectable()
export class MongoRoomDataService
  extends BaseRoomDataService
  implements RoomDataService
{
  constructor(@InjectModel(Room.name) private model: Model<RoomDocument>) {
    super();
  }

  async findById(id: string): Promise<Room | null> {
    return this.model.findById(id);
  }

  async create(dto: CreateRoomDto): Promise<Room> {
    const room = this.createRoom(dto);
    return this.model.create(room);
  }

  async update(room: Room): Promise<Room | null> {
    return this.model.findByIdAndUpdate(room._id, room, { new: true });
  }
}
