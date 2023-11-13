import { PositionDto } from '../dto/position.dto';
import { SequenceValidator } from './sequence-validator.type';

export const diagonalSequenceValidator: SequenceValidator = (
  previous: PositionDto,
  current: PositionDto,
) => {
  return (
    Math.abs(previous.x - current.x) === 1 &&
    Math.abs(previous.y - current.y) === 1
  );
};
