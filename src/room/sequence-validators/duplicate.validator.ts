import { PositionDto } from '../dto/position.dto';
import { SequenceValidator } from './sequence-validator.type';

export const duplicateSequenceValidator: SequenceValidator = (
  previous: PositionDto,
  current: PositionDto,
) => {
  return previous.x === current.x && previous.y === current.y;
};
