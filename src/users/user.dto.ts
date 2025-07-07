import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class createUserDto{
    @ApiProperty({
        example:'jose',
        description:'nome completo do usuário'
    })
    @IsNotEmpty({message:"O nome é obrigatório"})
    @MinLength(3,{message:"Minimo 3 caracter"})
    name:string
        @ApiProperty({
        example:'jose@gmail.com',
        description:'email do usuário'
    })
    @IsEmail({},{message:"O email deve ser um endereço válido"})
    email:string

    @IsString()
    password:string
}