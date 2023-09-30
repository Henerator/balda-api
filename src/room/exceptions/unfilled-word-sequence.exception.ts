import { RoomExceptionId } from './room-exception-id.enum';
import { RoomException } from './room.exception';

export class UnfilledWordSequenceException extends RoomException {
  constructor() {
    super(
      RoomExceptionId.unfilledWordSequence,
      'Word chars sequence has empty ones',
    );
  }
}
