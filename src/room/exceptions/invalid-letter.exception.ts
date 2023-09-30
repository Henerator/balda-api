import { RoomExceptionId } from './room-exception-id.enum';
import { RoomException } from './room.exception';

export class InvalidLetterException extends RoomException {
  constructor() {
    super(RoomExceptionId.invalidLetter, 'New letter is invalid');
  }
}
