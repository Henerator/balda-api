import { RoomExceptionId } from './room-exception-id.enum';
import { RoomException } from './room.exception';

export class UnknownRoomException extends RoomException {
  constructor() {
    super(RoomExceptionId.unknown, 'Unknown exception');
  }
}
