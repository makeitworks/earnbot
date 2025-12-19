import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class Phone {
    @Prop({ type: String, required: true, unique: true, index: true, match:/^\+[1-9]\d{1,14}$/})
    e164: string;

    @Prop({ type: String, required: true, uppercase: true })
    countryCode: string;

    @Prop({ type: String, required: true})
    callingCode: string;

    @Prop({ type: String, required: true })
    nationalNumber: string;
}

export const PhoneSchema = SchemaFactory.createForClass(Phone);