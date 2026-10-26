import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    minlength: 3,
    max_length: 20,
    required: true,
  })
  name!: string;

  @Prop({
    unique: true,
    required: true,
  })
  email!: string;

  @Prop({
    minlength: 8,
    max_length: 20,
    required: true,
  })
  password!: string;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  Role!: string;

  @Prop()
  avatar!: string;

  @Prop()
  age!: number;

  @Prop()
  phone!: string;

  @Prop()
  address!: string;

  @Prop({
    enum: ['active', 'inactive'],
    default: 'inactive',
  })
  active!: boolean;

  @Prop()
  verificationCode!: string;

  @Prop({
    enum: ['male', 'female'],
  })
  gender!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
