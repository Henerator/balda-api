import { IsString } from 'class-validator';

export class FindWordDto {
  @IsString()
  value: string;

  constructor(value: string) {
    this.value = value;
  }
}
