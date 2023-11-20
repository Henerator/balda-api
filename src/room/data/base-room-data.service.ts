import { CreateRoomDto } from '../dto/create-room.dto';
import { LetterSequenceRule } from '../models/letter-sequence-rule.enum';
import { RoomState } from '../models/room-state.enum';
import { Room } from '../models/room.model';

export class BaseRoomDataService {
  protected createRoom(dto: CreateRoomDto): Room {
    const room = new Room();
    room.size = dto.size;
    room.capacity = 2;
    room.state = RoomState.waitingPlayers;
    room.currentPlayerName = null;
    room.players = [];
    room.matrix = this.createMatrix(dto.size);
    room.letterSequenceRules = this.getLetterSequenceRules(dto);
    return room;
  }

  private createMatrix(size: number): string[][] {
    return new Array(size).fill(null).map(() => new Array(size).fill(null));
  }

  private getLetterSequenceRules(dto: CreateRoomDto): LetterSequenceRule[] {
    const rules = [];

    if (dto.allowDiagonalLetter) {
      rules.push(LetterSequenceRule.diagonal);
    }

    if (dto.allowDuplicateLetter) {
      rules.push(LetterSequenceRule.duplicate);
    }

    return rules;
  }
}
