import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './entities/auth.entity';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { RefToken } from './entities/refresh-tokens.schema';
import {v4 as uuid} from 'uuid'
import { refreshTwoTokents } from './dto/refresh-token.dto';
import { ref } from 'process';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly authRepo : Model<Auth>,
    @InjectModel(RefToken.name) private readonly refTokenRepo : Model<RefToken>,
    private readonly jwt : JwtService
  ){}

  async create(createAuthDto: CreateAuthDto) {
   try {
    if(createAuthDto.password!==createAuthDto.return_password) throw new BadRequestException(`parollar bir xil bo'lishi kerak`) // pass/re_pass match qilinvotti
      const hashed_pass= await bcrypt.hash(createAuthDto.password, 12)               // password hashlanvotti
    
      return await this.authRepo.create(                                             //user saqlanvotti
        {
          email : createAuthDto.email,
          name : createAuthDto.name,
          password : hashed_pass
      })
   } catch (e) {
    throw new HttpException(e.message , e.status??500)
   }
  }

  async login(dto : LoginDto){
    try {
      const user = await this.authRepo.findOne({email : dto.email})                     // user dbdan qidirilvotti
      if (!user) throw new UnauthorizedException('email or password incorrect')         // user kemasa unauth otvotti
        const passwordMatch = await bcrypt.compare(dto.password , user.password)        // pasword dbgan compare qilinvotti
      if(!passwordMatch) throw new UnauthorizedException('email or password incorrect') // !match => unauth otvotti
        return await this.generateTokens(user._id)                                      // match => 15 minut uchun accessToken yaratilvotti
    } catch (error) {
      throw new HttpException(error.message , error.status??500)                        // nerealni errolar uchun 
    }
  }

  async generateTokens (userId : Types.ObjectId){                                       // auth & refresh tokenlarni generatsiya qilaydigon funksiya
    const accessToken = this.jwt.sign({userId}, {expiresIn : '15m'})                    // accessToken yarataydigon
    const refreshToken =  uuid()                                                        // unique refreshToken yarataydigon
    await this.storefreshToken(refreshToken, userId)                                    // refresh tokenni dbga userId bilan saqlutti
    return {accessToken, refreshToken}                                                  // ikkov tokenlarni ham response qilib jo'natutti
  }
  
  async storefreshToken(token : string, userId : Types.ObjectId){                       // refreshToken ni dbga saqlaberaydigon funiksiya
     await this.refTokenRepo.updateOne({userId}, {token,$set :{expiryDate : Date.now()+(7*24*60**2*1000)}}, {upsert : true})
  }
  
  async refreshAll(refresh_token : string){                                             // accessToken charchaganda yangilaberaydigon funiksiya
    const token = await this.refTokenRepo.findOne({                                     // refreshTokenni dbdan qidirutti
      token : refresh_token,                                                            // body => refresh_token(hali chachamagan bo'ladi)
      expiryDate : {$gte : new Date()}                                                  // tugashi hozirdan keyin (hali chachamagan)
    }) 
    if(!token) throw new UnauthorizedException()                                        // !token => bor ukam chekaro o'yna ditti
      return await this.generateTokens(token.userId)                                    // token  => ikkov tokenni ham yangilab qaytarvotti
  }

}