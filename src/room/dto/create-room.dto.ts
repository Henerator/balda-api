import { IsNumber, Max, Min } from 'class-validator';

export class CreateRoomDto {
  @IsNumber()
  @Min(5)
  @Max(7)
  size: number;
}
