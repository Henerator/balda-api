import { LetterDto } from './letter.dto';
import { PositionDto } from './position.dto';

export class NewWordMessageDto {
  roomId: string;
  playerName: string;
  letter: LetterDto;
  word: PositionDto[];
}
