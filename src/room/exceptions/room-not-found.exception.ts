import { RoomExceptionId } from './room-exception-id.enum';
import { RoomException } from './room.exception';

export class RoomNotFoundException extends RoomException {
  constructor(id: string) {
    super(
      RoomExceptionId.roomNotFound,
      `Could not find the room with id: ${id}`,
    );
  }
}
