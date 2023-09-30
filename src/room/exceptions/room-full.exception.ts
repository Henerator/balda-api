import { RoomExceptionId } from './room-exception-id.enum';
import { RoomException } from './room.exception';

export class RoomFullException extends RoomException {
  constructor() {
    super(
      RoomExceptionId.roomFull,
      'Could not join the room. Room is already full',
    );
  }
}
