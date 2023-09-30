import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './models/room.model';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly service: RoomService) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateRoomDto): Promise<Room> {
    return this.service.create(dto);
  }
}
