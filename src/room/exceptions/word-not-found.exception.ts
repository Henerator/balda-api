import { RoomExceptionId } from './room-exception-id.enum';
import { RoomException } from './room.exception';

export class WordNotFoundException extends RoomException {
  constructor(word: string) {
    super(RoomExceptionId.wordNotFound, `Could not find the word: ${word}`);
  }
}
