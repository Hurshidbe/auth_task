import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate{                                               // Guard (oxrana) okamiza        
    constructor(private jwt:JwtService){}

    canActivate(context: ExecutionContext) :Promise<boolean>| boolean | Observable<boolean>{ // karocke typeni keragini tanlavoladla
        const req = context.switchToHttp().getRequest()                                      // accessToken reqga keladi, shunga tutvommiza
        const token = req.headers.authorization?.split(' ')[1];                              // tokenni okalarini ichidan ajratvommiza
        if(!token) throw new UnauthorizedException('invalid token')                          // okalarini ichida yo' bo'sa bettan sur devommiz
        try {
            const payload = this.jwt.verify(token)                                           // accessTokenni oxrana tekshirvotti
            req.userId = payload.userId                                                      // reqni o'tkizvotti
        } catch (error) {
            throw new UnauthorizedException('invalid token')                                 // itrisqi token soxteka. throw qivotti
        }
        return true                                                                          // catchga tishib qomasa true
    }
}