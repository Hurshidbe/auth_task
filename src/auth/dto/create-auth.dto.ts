import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length, MaxLength,  MinLength } from "class-validator";

export class CreateAuthDto {

  @IsString()
  @Length(4,100)
  @IsNotEmpty()
  name! : string

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email! : string

  @IsStrongPassword({
    minLength : 6,
    minLowercase : 1
  })
  @MinLength(6)
  @MaxLength(100)
  password! : string

  @IsString()
  @IsNotEmpty()
  return_password! : string
}

export class LoginDto{

    @MaxLength(50)
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email! : string

    @IsString()
    @Length(6,16)
    password! : string

  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  return_password! : string
}


