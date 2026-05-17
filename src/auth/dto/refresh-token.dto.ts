import { IsNotEmpty, IsString } from "class-validator";

export class refreshTwoTokents{
    @IsNotEmpty()
    @IsString()
    refresh_token! : string
}