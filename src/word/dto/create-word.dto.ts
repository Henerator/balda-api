import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWordDto {
  @IsString()
  @MinLength(1)
  @MaxLength(35)
  value: string;

  constructor(value: string) {
    this.value = value;
  }
}
