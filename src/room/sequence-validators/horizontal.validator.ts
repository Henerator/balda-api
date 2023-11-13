import { PositionDto } from '../dto/position.dto';
import { SequenceValidator } from './sequence-validator.type';

export const horizontalSequenceValidator: SequenceValidator = (
  previous: PositionDto,
  current: PositionDto,
) => {
  return previous.y === current.y && Math.abs(previous.x - current.x) === 1;
};
