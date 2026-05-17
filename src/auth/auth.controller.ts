import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { refreshTwoTokents } from './dto/refresh-token.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')                                 // user registratsiyadan o'tyatti
  create(@Body() createAuthDto: CreateAuthDto) {    // body tutilyapti
    return this.authService.create(createAuthDto);  // body servicega uzatilvotti
  }

  @Post('login')                                    // loginga api
  async login(@Body() dto : LoginDto){              // dtodan o'tgan body kevotti
    return await this.authService.login(dto)        // dto servicega uzatilvotti
  }

  @Post('refresh')                                  // accessToken eskibqosa shunga call qilishadda
  async refreshTwoTokents(@Body() dto : refreshTwoTokents){
    return await this.authService.refreshAll(dto.refresh_token) //keyin bettan yangi 2ta token ovolishadi
  }

  @UseGuards(AuthGuard)
  @Get('test')                                      // ishleshiga ishonmitganla uchun
  async guardTest(){
    return 'hello this is just a test message for verified users'
  }
}
