import { RoomExceptionId } from './room-exception-id.enum';
import { RoomException } from './room.exception';

export class NoLetterInSequenceException extends RoomException {
  constructor() {
    super(
      RoomExceptionId.noLetterInSequence,
      'New letter is not used in the new word',
    );
  }
}
