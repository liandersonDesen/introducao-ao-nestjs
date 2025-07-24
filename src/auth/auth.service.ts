import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register.dto';
import * as bcrypt from "bcrypt"
import { LoginDto } from './dto/login.dto';
import { access } from 'fs';
import { user } from '@prisma/client';
@Injectable()
export class AuthService {

    constructor(private jwt:JwtService, private prisma:PrismaService){}

    async registerUser(userData:RegisterUserDto){
        const userExists = await this.prisma.user.findUnique({
            where:{email:userData.email}
        })

        if(userExists){
            throw new ConflictException("Email já está em uso!!")
        }

        const hashedPassword = await bcrypt.hash(userData.password,10)

        const newUser = await this.prisma.user.create({
            data:{
                name:userData.name,
                email:userData.email,
                password:hashedPassword
            },
            select:{
                id:true,
                name:true,
                email:true,
                role:true
            }
        })

    return newUser
    }
    async validateUser(email:string,password:string){
        const user = await this.prisma.user.findUnique({where:{email}})
        if(!user) throw new UnauthorizedException("Credenciais inválidas!")
        
        if(!user.password) throw new UnauthorizedException('Usuário não possui senha definido (Logar com o google)')
        
        const isMath = await bcrypt.compare(password,user.password)
        if(!isMath) throw new UnauthorizedException("Credenciais inválidas!")
    
        return user
    }
    async login(Credencials:LoginDto){
        const user = await this.validateUser(Credencials.email,Credencials.password)
        const payload = {
            sub:user.id,
            email:user.email,
            role:user.role
        }
        return {
            acess_token: this.jwt.sign(payload)
        }
    }

    async findOrCreateGoogleUser({googleId,email,name}){
        let user = await this.prisma.user.findUnique({
            where:{googleId}
        })
        if(!user){
            user = await this.prisma.user.create({
                data:{
                    email,
                    name,
                    googleId
                }
            })
        }

        return user;
    }

    signJwtForUser(user:user){
        const payload = {
            sub: user.id,
            email:user.email,
            role:user.role
        }
        return this.jwt.sign(payload)
    }

}
