import { RoomExceptionId } from './room-exception-id.enum';

export class RoomException {
  constructor(
    public id: RoomExceptionId,
    public message: string,
  ) {}
}
