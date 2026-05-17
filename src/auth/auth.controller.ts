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

  @Post('register')                                 
  create(@Body() createAuthDto: CreateAuthDto) {    
    return this.authService.create(createAuthDto);  
  }

  @Post('login')                                   
  async login(@Body() dto : LoginDto){          
    return await this.authService.login(dto)       
  }

  @Post('refresh')                               
  async refreshTwoTokents(@Body() dto : refreshTwoTokents){
    return await this.authService.refreshAll(dto.refresh_token) 
  }

  @UseGuards(AuthGuard)
  @Get('test')                                     
  async guardTest(){
    return 'hello this is just a test message for verified users'
  }
}
