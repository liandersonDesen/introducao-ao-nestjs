import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"
import { createUserDto } from "./user.dto";
const mockUser=[
    { id: "jdjbjbjjdbbbahb", name: "Jonas", email: "jonas@example.com", password: "123", role: "Turista" },
    { id: "hbashbshshbshs", name: "José", email: "jose@example.com", password: "1234", role: "Turista" }
]
const mockUserServices = {
    findAllUser: jest.fn().mockResolvedValue(mockUser),
    findIdUser:jest.fn().mockResolvedValue(mockUser[0]),
    createUser:jest.fn().mockResolvedValue(mockUser[0]),
    atualizaUsuario:jest.fn().mockResolvedValue(mockUser[0]),
    deletarUsuario:jest.fn().mockResolvedValue(mockUser[0])
}

describe("User Controller Tests", ()=>{
    let controller :UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers:[UsersController],
            providers:[{provide:UsersService, useValue:mockUserServices}]
        }).compile();

        controller = module.get<UsersController>(UsersController)
    })

  it('deve listar todos os usuários', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(mockUser);
    expect(mockUserServices.findAllUser).toHaveBeenCalledTimes(1);
  });

  it('deve listar um usuário pelo id', async () => {
    const result = await controller.findFromId('jdjbjbjjdbbbahb');
    expect(result).toEqual(mockUser[0]);
    expect(mockUserServices.findIdUser).toHaveBeenCalledWith('jdjbjbjjdbbbahb');
  });

  it('deve criar um usuário', async () => {
    const userDto: createUserDto = {
      name: 'Jonas',
      email: 'jonas@example.com',
      password: '123',
    };

    const result = await controller.createUser(userDto);
    expect(result).toEqual(mockUser[0]);
    expect(mockUserServices.createUser).toHaveBeenCalledWith(userDto);
  });

  it('deve atualizar um usuário', async () => {
    const userDto: createUserDto = {
      name: 'Jonas Atualizado',
      email: 'jonas@example.com',
      password: '123',
    };

    const result = await controller.UpdateUser('jdjbjbjjdbbbahb', userDto);
    expect(result).toEqual(mockUser[0]);
    expect(mockUserServices.atualizaUsuario).toHaveBeenCalledWith('jdjbjbjjdbbbahb', userDto);
  });

  it('deve deletar um usuário', async () => {
    const result = await controller.DeleteUser('jdjbjbjjdbbbahb');
    expect(result).toEqual(mockUser[0]);
    expect(mockUserServices.deletarUsuario).toHaveBeenCalledWith('jdjbjbjjdbbbahb');
  });
})
