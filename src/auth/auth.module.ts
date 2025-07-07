import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthService,PrismaService,JwtStrategy],
  controllers: [AuthController],
  imports:[
    JwtModule.register({
      secret:process.env.SECRET_KEY,
      signOptions:{expiresIn:'1h'}
    })
  ]
})
export class AuthModule {}
