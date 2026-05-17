import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv'
import { JwtModule } from '@nestjs/jwt';
dotenv.config()

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB ?? ''),
    JwtModule.register({
      global : true,
      secret : process.env.JWT_SECRET,
      signOptions : {expiresIn : '15m'}
    }),
    AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
