import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

const mockPrisma = {
    user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }
}
// Testes para o UsersService
// Aqui estamos criando uma suite de testes para o UsersService, que é responsável por gerenciar usuários
// Usamos o Jest para criar mocks e verificar se as funções estão sendo chamadas corretamente
describe("UsersService", () => {
    let service: UsersService;

    // Antes de cada teste, criamos uma instância do UsersService com o PrismaService mockado
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    // Testes individuais
    // Aqui definimos os testes individuais para cada funcionalidade do UsersService
    it("deve criar um usuário", async () => {
        const dto = { name: "Jonas", email: "jonas@example.com", password: "123" };
        mockPrisma.user.create.mockResolvedValue(dto);

        const result = await service.createUser(dto as any);
        expect(result).toEqual(dto);
        expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: dto });
    });

    it("deve listar todos os usuário", async () => {
        const listaUsuario = [{ id: "jdjbjbjjdbbbahb", name: "Jonas", email: "jonas@example.com", password: "123", role: "Turista" }, { id: "hbashbshshbshs", name: "José", email: "jose@example.com", password: "1234", role: "Turista" }];

        mockPrisma.user.findMany.mockResolvedValue(listaUsuario);

        const result = await service.findAllUser();
        expect(result).toEqual(listaUsuario);
        expect(mockPrisma.user.findMany).toHaveBeenCalledWith();
    });

    it("deve listar o usuário por id", async () => {
        const Usuario = { id: "jdjbjbjjdbbbahb", name: "Jonas", email: "jonas@example.com", password: "123", role: "Turista" };

        mockPrisma.user.findUnique.mockResolvedValue(Usuario);

        const result = await service.findIdUser("jdjbjbjjdbbbahb");
        expect(result).toEqual(Usuario);
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: "jdjbjbjjdbbbahb" } });
    });

    it("deve atualizar um usuário", async () => {
        const userId = "gaafsffafafafa";
        const updateDto = { name: "Jonas Updated" };
        const updatedUser = { id: userId, ...updateDto };

        mockPrisma.user.update.mockResolvedValue(updatedUser);

        const result = await service.atualizaUsuario(userId, updateDto as any);
        expect(result).toEqual(updatedUser);
        expect(mockPrisma.user.update).toHaveBeenCalledWith({ where: { id: userId }, data: updateDto });
    });

    it("deve deletar um usuário", async () => {
        const userId = "1";
        const deletedUser = { id: userId, name: "Jonas" };
        mockPrisma.user.delete.mockResolvedValue(deletedUser);

        const result = await service.deletarUsuario(userId);
        expect(result).toEqual(deletedUser);
        expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
    });

});

// Executar os  testes: npm test