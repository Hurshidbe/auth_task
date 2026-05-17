import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './entities/auth.entity';
import { RefToken, RefTokenSchema } from './entities/refresh-tokens.schema';

@Module({
  imports : [
    MongooseModule.forFeature([
      {name : Auth.name, schema: AuthSchema},           // auth schema connect qivolinitti
      {name : RefToken.name, schema: RefTokenSchema}    // token saqlaydigon schema connect qivolinitti
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
