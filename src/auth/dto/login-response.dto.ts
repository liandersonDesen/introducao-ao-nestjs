import { IsString } from "class-validator";


export class LoginReponseDto {
    @IsString()
    acess_token:string;
}