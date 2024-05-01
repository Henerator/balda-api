import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateRoomDto {
  @IsNumber()
  @Min(3)
  @Max(10)
  size: number;

  @IsNumber()
  repeatLimit: number;

  @IsOptional()
  @IsBoolean()
  allowDiagonalLetter?: boolean;

  @IsOptional()
  @IsBoolean()
  allowDuplicateLetter?: boolean;
}
