import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LetterSequenceRule } from './letter-sequence-rule.enum';
import { Player, PlayerSchema } from './player.model';
import { RoomState } from './room-state.enum';

@Schema({ timestamps: true })
export class Room {
  _id: string;

  @Prop()
  size: number;

  @Prop()
  capacity: number;

  @Prop()
  repeatLimit: number;

  @Prop({ enum: RoomState, type: String })
  state: RoomState;

  @Prop()
  currentPlayerName: string;

  @Prop({ type: [PlayerSchema] })
  players: Player[];

  @Prop([[String]])
  matrix: string[][];

  @Prop()
  initialWord: string;

  @Prop({ type: [{ enum: LetterSequenceRule, type: String }] })
  letterSequenceRules: LetterSequenceRule[];
}

export type RoomDocument = HydratedDocument<Room>;

export const RoomSchema = SchemaFactory.createForClass(Room);
