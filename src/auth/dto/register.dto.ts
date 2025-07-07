import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator'

export class RegisterUserDto {

    @ApiProperty({description:"Nome do usuário",example:"josé"})
    @IsString()
    name:string;

    
    @ApiProperty({description:"email do usuário",example:"jose@gmail.com"})
    @IsEmail()
    email:string;

    @ApiProperty({description:"senha do usuário",example:"senha123"})
    @IsString()
    @MinLength(8)
    password:string;

}