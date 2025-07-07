import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy,ExtractJwt } from "passport-jwt";

const rawSecretKey = process.env.SECRET_KEY;
if (!rawSecretKey) {
  throw new Error('SECRET_KEY is not defined');
}
const secretKey: string = rawSecretKey;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secretKey,
        })
    }
    async validate(payload:any){
        return {
            user:payload.userId,
            email:payload.email,
            role:payload.role
        }
    }
}