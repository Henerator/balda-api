import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Word {
  @Prop({ type: String, required: true, unique: true, index: true })
  value: string;
}

export type WordDocument = HydratedDocument<Word>;

export const WordSchema = SchemaFactory.createForClass(Word);
