import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Player {
  @Prop()
  name: string;

  @Prop([String])
  words: string[];

  @Prop()
  score: number;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
