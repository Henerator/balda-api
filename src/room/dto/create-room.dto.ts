import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateRoomDto {
  @IsNumber()
  @Min(5)
  @Max(7)
  size: number;

  @IsOptional()
  @IsBoolean()
  allowDiagonalLetter?: boolean;
}
