import { RoomExceptionId } from './room-exception-id.enum';
import { RoomException } from './room.exception';

export class NotCurrentPlayerTurnException extends RoomException {
  constructor() {
    super(RoomExceptionId.notCurrentPlayerTurn, 'Wait for your turn');
  }
}
