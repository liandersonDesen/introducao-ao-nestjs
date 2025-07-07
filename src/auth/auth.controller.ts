import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginReponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService){}

    @Post('register')
    @ApiBody({type:RegisterUserDto})
    @ApiCreatedResponse({description:"usuário registrado com sucesso"})
    @ApiConflictResponse({description:"Email já está em uso"})
    async registerUser(@Body() userData:RegisterUserDto){
        return this.authService.registerUser(userData)
    }


    @Post('login')
    @ApiBody({type: LoginDto})
    async login(@Body() Credentials:LoginDto):Promise<LoginReponseDto>{

        return this.authService.login(Credentials)

    }
}
