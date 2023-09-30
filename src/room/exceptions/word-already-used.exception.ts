import { RoomExceptionId } from './room-exception-id.enum';
import { RoomException } from './room.exception';

export class WordAlreadyUsedException extends RoomException {
  constructor() {
    super(RoomExceptionId.wordAlreadyUsed, 'The word already used before');
  }
}
