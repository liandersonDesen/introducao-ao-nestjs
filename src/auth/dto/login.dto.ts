import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";


export class LoginDto {
    
    @ApiProperty({description:"email do usuário",example:"jose@gmail.com"})
    @IsEmail({},{message:"O email precisa ser válido"})
    email:string;

    @ApiProperty({description:"senha do usuário",example:"senha123"})
    @IsString({message:"A senha deve ser uma string"})
    password:string;

}