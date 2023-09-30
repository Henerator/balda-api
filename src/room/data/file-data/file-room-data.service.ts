import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { readJson, writeJson } from 'fs-extra';
import { CreateRoomDto } from 'src/room/dto/create-room.dto';
import { Room } from 'src/room/models/room.model';
import { BaseRoomDataService } from '../base-room-data.service';
import { RoomDataService } from '../room-data.service';

@Injectable()
export class FileRoomDataService
  extends BaseRoomDataService
  implements RoomDataService
{
  private readonly filePath = `${path}/file-db/rooms.json`;

  async create(dto: CreateRoomDto): Promise<Room> {
    const room = this.createRoom(dto);
    await this.addRoom(room);
    return room;
  }

  async findById(id: string): Promise<Room | null> {
    const rooms = await this.readRooms();
    return rooms.find((room) => room._id === id);
  }

  async update(room: Room): Promise<Room | null> {
    const roomToUpdate = await this.findById(room._id);

    if (!roomToUpdate) return null;

    return this.updateRoom(room);
  }

  protected createRoom(dto: CreateRoomDto): Room {
    const room = super.createRoom(dto);
    room._id = Math.ceil(Math.random() * 100).toString();
    return room;
  }

  private async readRooms(): Promise<Room[]> {
    return readJson(this.filePath);
  }

  private async writeRooms(rooms: Room[]): Promise<void> {
    return await writeJson(this.filePath, rooms);
  }

  private async addRoom(room: Room): Promise<void> {
    const rooms = await this.readRooms();
    rooms.push(room);
    await this.writeRooms(rooms);
  }

  private async updateRoom(room: Room): Promise<Room | null> {
    const rooms = await this.readRooms();
    const roomIndex = rooms.findIndex(
      (searchRoom) => searchRoom._id === room._id,
    );

    if (roomIndex < 0) {
      return null;
    }

    rooms[roomIndex] = room;
    await this.writeRooms(rooms);

    return room;
  }
}
