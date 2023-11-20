import { Injectable } from '@nestjs/common';
import { LetterDto } from '../dto/letter.dto';
import { PositionDto } from '../dto/position.dto';
import { LetterSequenceRule } from '../models/letter-sequence-rule.enum';
import { Room } from '../models/room.model';
import { SequenceValidator } from '../sequence-validators/sequence-validator.type';
import { sequenceValidatorsMap } from '../sequence-validators/sequence-validators.map';

@Injectable()
export class SequenceHelper {
  public verifySequenceDuplicates(
    roomRules: LetterSequenceRule[],
    positions: PositionDto[],
  ): boolean {
    const isDuplicateAllowed = roomRules.includes(LetterSequenceRule.duplicate);
    return isDuplicateAllowed || !this.hasDuplicatesInSequence(positions);
  }

  public verifySequence(
    roomRules: LetterSequenceRule[],
    positions: PositionDto[],
  ): boolean {
    const validators = this.getSequenceValidators(roomRules);

    for (let i = 1; i < positions.length; i++) {
      const previous = positions[i - 1];
      const current = positions[i];

      const isCurrentValid = validators.some((validator) =>
        validator(previous, current),
      );

      if (!isCurrentValid) return false;
    }

    return true;
  }

  public isValidLetter(letter: LetterDto): boolean {
    return letter.char.length === 1;
  }

  public isPositionInField(room: Room, position: PositionDto): boolean {
    const fieldSize = room.matrix.length;

    return (
      position.x >= 0 &&
      position.x < fieldSize &&
      position.y >= 0 &&
      position.y < fieldSize
    );
  }

  public isPositionEmpty(room: Room, position: PositionDto): boolean {
    return !room.matrix[position.y][position.x];
  }

  public isSequenceValid(
    roomRules: LetterSequenceRule[],
    positions: PositionDto[],
  ): boolean {
    if (!this.verifySequenceDuplicates(roomRules, positions)) {
      return false;
    }

    if (!this.verifySequence(roomRules, positions)) {
      return false;
    }

    return true;
  }

  public isPositionInSequence(
    position: PositionDto,
    positions: PositionDto[],
  ): boolean {
    return positions.some(
      (searchPosition) =>
        searchPosition.x === position.x && searchPosition.y === position.y,
    );
  }

  public isSequenceFilled(room: Room, positions: PositionDto[]): boolean {
    return positions.every((position) => !this.isPositionEmpty(room, position));
  }

  private hasDuplicatesInSequence(positions: PositionDto[]): boolean {
    const uniquePositions = new Set(
      positions.map((pos) => `${pos.x}-${pos.y}`),
    );
    return positions.length > uniquePositions.size;
  }

  private getSequenceValidators(
    roomRules: LetterSequenceRule[],
  ): SequenceValidator[] {
    return [
      LetterSequenceRule.horizontal,
      LetterSequenceRule.vertical,
      ...roomRules,
    ].map((rule) => sequenceValidatorsMap[rule]);
  }
}
