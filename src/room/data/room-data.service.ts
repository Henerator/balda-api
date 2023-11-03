import { CreateRoomDto } from '../dto/create-room.dto';
import { Room } from '../models/room.model';

export abstract class RoomDataService {
  abstract findById(id: string): Promise<Room | null>;
  abstract create(dto: CreateRoomDto): Promise<Room>;
  abstract update(room: Room): Promise<Room | null>;
  abstract deleteOlderThan(date: Date): Promise<mongodb.DeleteResult>;
}
