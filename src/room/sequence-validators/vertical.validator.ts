import { PositionDto } from '../dto/position.dto';
import { SequenceValidator } from './sequence-validator.type';

export const verticalSequenceValidator: SequenceValidator = (
  previous: PositionDto,
  current: PositionDto,
) => {
  return previous.x === current.x && Math.abs(previous.y - current.y) === 1;
};
