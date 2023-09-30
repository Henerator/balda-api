import { RoomExceptionId } from './room-exception-id.enum';
import { RoomException } from './room.exception';

export class InvalidWordSequenceException extends RoomException {
  constructor() {
    super(
      RoomExceptionId.invalidWordSequence,
      'Word chars sequence is invalid',
    );
  }
}
