import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Phone, PhoneSchema } from "./phone.schema";

@Schema()
export class User {
    @Prop()
    uid: string;

    @Prop({ type: String, minLength:2, maxLength: 30})
    name: string;

    @Prop()
    avatar: string;

    @Prop({ type: String, required: true})
    password: string;

    @Prop(PhoneSchema)
    phone: Phone;

    @Prop({ type: String, required: false})
    email: string;

    @Prop({ type: Date})
    createTime: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocumentOverride = {
    phone: Types.Subdocument<Types.ObjectId> & Phone;
}

export type UserDocument = HydratedDocument<User, UserDocumentOverride>;
