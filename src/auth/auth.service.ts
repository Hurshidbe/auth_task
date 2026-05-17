import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './entities/auth.entity';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { RefToken } from './entities/refresh-tokens.schema';
import {v4 as uuid} from 'uuid'
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
    if(createAuthDto.password!==createAuthDto.return_password) throw new BadRequestException(`parollar bir xil bo'lishi kerak`) 
      const hashed_pass= await bcrypt.hash(createAuthDto.password, 12)              
    
      return await this.authRepo.create(                                          
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
      const user = await this.authRepo.findOne({email : dto.email})                     
      if (!user) throw new UnauthorizedException('email or password incorrect')         
        const passwordMatch = await bcrypt.compare(dto.password , user.password)        
      if(!passwordMatch) throw new UnauthorizedException('email or password incorrect') 
        return await this.generateTokens(user._id)                                      
    } catch (error) {
      throw new HttpException(error.message , error.status??500)                       
    }
  }

  async generateTokens (userId : Types.ObjectId){                                       
    const accessToken = this.jwt.sign({userId}, {expiresIn : '15m'})                    
    const refreshToken =  uuid()                                                        
    await this.storefreshToken(refreshToken, userId)                                   
    return {accessToken, refreshToken}                                                  
  }
  
  async storefreshToken(token : string, userId : Types.ObjectId){                      
     await this.refTokenRepo.updateOne({userId}, {token,$set :{expiryDate : Date.now()+(7*24*60**2*1000)}}, {upsert : true})
  }
  
  async refreshAll(refresh_token : string){                                            
    const token = await this.refTokenRepo.findOne({                                
      token : refresh_token,                                                         
      expiryDate : {$gte : new Date()}                                              
    }) 
    if(!token) throw new UnauthorizedException()                                      
      return await this.generateTokens(token.userId)                                   
  }

}