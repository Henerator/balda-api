import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTimeService } from 'src/date-time/date-time.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './models/room.model';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(
    private readonly service: RoomService,
    private dateTimeService: DateTimeService,
  ) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateRoomDto): Promise<Room> {
    return this.service.create(dto);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'clearInactiveRooms' })
  async clearInactiveRooms(): Promise<void> {
    const roomLiveDays = 3;
    const minActiveDate = this.dateTimeService.addDays(
      new Date(),
      -roomLiveDays,
    );
    await this.service.deleteOlderThan(minActiveDate);
  }
}
