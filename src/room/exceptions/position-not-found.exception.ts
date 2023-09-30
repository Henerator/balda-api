import { PositionDto } from '../dto/position.dto';
import { RoomExceptionId } from './room-exception-id.enum';
import { RoomException } from './room.exception';

export class PositionNotFoundException extends RoomException {
  constructor(position: PositionDto) {
    super(
      RoomExceptionId.positionNotFound,
      `Could not find the position: [${position.y}; ${position.x}]`,
    );
  }
}
