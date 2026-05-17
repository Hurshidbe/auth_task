import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps : true})
export class Auth {
    @Prop()
    name : string

    @Prop({required : true, unique : true})
    email : string
    
    @Prop({required : true})
    password : string

    @Prop({default : false})
    mailverified? : boolean

}
export const AuthSchema = SchemaFactory.createForClass(Auth)
