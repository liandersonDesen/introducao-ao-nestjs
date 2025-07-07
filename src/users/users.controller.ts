import { Controller, Get, Post, Put, Delete, Param, Body, ConflictException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service'
import { createUserDto } from './user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @ApiBearerAuth()
    @Get()
    @ApiOperation({summary:"Mostrar todos os Usuários"})
    @ApiResponse({status:200, description:'Busca feita com sucesso'})
    findAll() {
        return this.userService.findAllUser()
    }
    @ApiBearerAuth()
    @Get('/:id')
    @ApiOperation({summary:"Mostra um usuário pelo o id"})
    @ApiParam({name:'id', type:String, description:"Id do Usuário" })
    @ApiResponse({status:200, description:'usuário encontrado '})
    findFromId(@Param('id') id: string) {
        return this.userService.findIdUser(id)
    }
    
    @ApiBearerAuth()
    @Post()
    @ApiOperation({summary:'Criar um novo Usuario'})
    @ApiBody({type:createUserDto})
    @ApiResponse({status:201, description:'usuário criado com sucesso'})
    createUser(@Body() data: createUserDto) {
            return this.userService.createUser(data)
    }
    
    @ApiBearerAuth()
    @Put(':id')
    @ApiOperation({summary:'Atualiza um Usuario'})
    @ApiBody({type:createUserDto})
    @ApiParam({name:'id', type:String, description:"Id do Usuário" })
    @ApiResponse({status:200, description:'usuário atualizado com sucesso'})
    UpdateUser(@Param('id') id: string, @Body() data: createUserDto) {
        try {
            return this.userService.atualizaUsuario(id,data)
            
        } catch (error) {
            return 
        }
    }
    @ApiBearerAuth()
    @Delete(':id')
    @ApiOperation({summary:'Deleta um usuário'})
    @ApiParam({name:'id', type:String, description:"Id do Usuário" })
    @ApiResponse({status:200, description:'usuário deletado com sucesso'})
    DeleteUser(@Param('id') id: string) {
        return this.userService.deletarUsuario(id)
    }
}
