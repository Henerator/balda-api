import { PositionDto } from '../dto/position.dto';

export type SequenceValidator = (
  previous: PositionDto,
  current: PositionDto,
) => boolean;
