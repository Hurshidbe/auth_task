import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {  Mongoose } from "mongoose";

@Schema({timestamps : true })
export class RefToken {

    @Prop({required : true})
    token : string

    @Prop({required  :true , type:mongoose.Types.ObjectId})
    userId : mongoose.Types.ObjectId

    @Prop({required : true})
    expiryDate: Date

}

export const RefTokenSchema = SchemaFactory.createForClass(RefToken)
