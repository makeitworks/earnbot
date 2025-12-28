import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema()
export class User {
    @Prop()
    uid: string;

    @Prop({ type: String, minLength: 2, maxLength: 30, unique: true })
    name: string;

    @Prop({ type: String, required: true, unique: true })
    email: string;

    @Prop()
    avatar: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: Date })
    createTime: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
