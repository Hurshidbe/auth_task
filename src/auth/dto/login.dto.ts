import { IsNotEmpty, IsString, Length, MaxLength } from "class-validator"

export class LoginDto{

    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    email! : string

    @IsString()
    @Length(6,16)
    password! : string
}