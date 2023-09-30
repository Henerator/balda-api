import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Player, PlayerSchema } from './player.model';
import { RoomState } from './room-state.enum';

@Schema({ timestamps: true })
export class Room {
  _id: string;

  @Prop()
  size: number;

  @Prop()
  capacity: number;

  @Prop({ enum: RoomState, type: String })
  state: RoomState;

  @Prop()
  currentPlayerName: string;

  @Prop({ type: [PlayerSchema] })
  players: Player[];

  @Prop([[String]])
  matrix: string[][];
}

export type RoomDocument = HydratedDocument<Room>;

export const RoomSchema = SchemaFactory.createForClass(Room);
