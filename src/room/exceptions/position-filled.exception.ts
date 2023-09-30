import { RoomExceptionId } from './room-exception-id.enum';
import { RoomException } from './room.exception';

export class PositionFilledException extends RoomException {
  constructor() {
    super(RoomExceptionId.positionFilled, 'Position is already filled');
  }
}
