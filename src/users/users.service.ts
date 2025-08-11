 import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { user, Prisma } from "@prisma/client"
@Injectable()
export class UsersService {
    constructor(private prisma:PrismaService ) {}

   async findAllUser():Promise<user[]> {
    return this.prisma.user.findMany()
   } 

   async findIdUser(id:string):Promise<user | null>{
    return this.prisma.user.findUnique({where:{id}})
   }

   async createUser(data:Prisma.userCreateInput): Promise<user>{
    return this.prisma.user.create({data})
   }
   async atualizaUsuario(id:string,data:Prisma.userCreateInput): Promise<user>{
     return this.prisma.user.update({where:{id},data:data})
   }
   async deletarUsuario(id:string): Promise<user>{
    return this.prisma.user.delete({where:{id}})
   }
}

