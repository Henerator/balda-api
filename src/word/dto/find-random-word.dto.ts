import { IsNumber, Min } from 'class-validator';

export class FindRandomWordDto {
  @Min(1)
  @IsNumber()
  length: number;

  constructor(length: number) {
    this.length = length;
  }
}
