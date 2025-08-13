import { Test, TestingModule } from '@nestjs/testing';
import { PlaceService } from './place.service';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from './cloudinary.service';
import { BadRequestException } from '@nestjs/common';
import { Place } from '@prisma/client';
import { ImageObject } from './types/image-object';

// Dados simulados para locais e imagens
const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Test Place 1',
    type: 'RESTAURANTE',
    phone: '123456789',
    latitude: 10,
    longitude: 20,
    images: [{ public_id: 'public-id-1', secure_url: 'url-1' }] as any, // Conversão para any para corresponder ao tipo ImageObject[]
    create_at: new Date(),
  },
  {
    id: '2',
    name: 'Test Place 2',
    type: 'HOTEL',
    phone: '987654321',
    latitude: 30,
    longitude: 40,
    images: [{ public_id: 'public-id-2', secure_url: 'url-2' }] as any,
    create_at: new Date(),
  },
];

const mockImageObject: ImageObject = {
  public_id: 'new-public-id',
  url: 'new-secure-url',
};

// Simular (mock) o PrismaService e o CloudinaryService
const mockPrismaService = {
  place: {
    findMany: jest.fn().mockResolvedValue(mockPlaces),
    findUnique: jest.fn(),
    create: jest.fn().mockResolvedValue(mockPlaces[0]),
    update: jest.fn().mockResolvedValue(mockPlaces[0]),
    delete: jest.fn().mockResolvedValue(mockPlaces[0]),
    count: jest.fn().mockResolvedValue(mockPlaces.length),
  },
  $transaction: jest.fn(),
};

const mockCloudinaryService = {
  uploadImage: jest.fn().mockResolvedValue(mockImageObject),
  deleteImage: jest.fn().mockResolvedValue(true),
};

describe('PlaceService', () => {
  let service: PlaceService;
  let prisma: PrismaService;
  let cloudinary: CloudinaryService;

  beforeEach(async () => {
    // Criar um módulo de teste para fornecer os serviços e seus mocks
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    }).compile();

    service = module.get<PlaceService>(PlaceService);
    prisma = module.get<PrismaService>(PrismaService);
    cloudinary = module.get<CloudinaryService>(CloudinaryService);

    // Reiniciar todas as funções mock antes de cada teste para garantir um estado limpo
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  // --- Casos de Teste para findAll ---
  describe('findAll', () => {
    it('deve retornar um array de locais', async () => {
      const result = await service.findAll();
      expect(prisma.place.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockPlaces);
    });
  });

  // --- Casos de Teste para findPaginated ---
  describe('findPaginated', () => {
    it('deve retornar dados paginados com informações de meta corretas', async () => {
      // Simular a chamada $transaction para retornar os locais e a contagem total
      mockPrismaService.$transaction.mockResolvedValue([mockPlaces, mockPlaces.length]);
      const page = 1;
      const limit = 10;
      const result = await service.findPaginated(page, limit);

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(result.data).toEqual(mockPlaces);
      expect(result.meta).toEqual({
        total: mockPlaces.length,
        page,
        lastPage: Math.ceil(mockPlaces.length / limit),
      });
    });
  });

  // --- Casos de Teste para create ---
  describe('create', () => {
    it('deve criar um novo local', async () => {
      const newPlaceData = {
        name: 'New Place',
        type: 'Hotel',
        phone: '111222333',
        latitude: 50,
        longitude: 60,
        images: [mockImageObject],
      };
      const result = await service.create(newPlaceData);
      expect(prisma.place.create).toHaveBeenCalledWith({ data: newPlaceData });
      expect(result).toEqual(mockPlaces[0]);
    });
  });

  // --- Casos de Teste para update ---
  describe('update', () => {
    it('deve atualizar um local existente sem novas imagens', async () => {
      const updatedData = { name: 'Updated Name' };
      mockPrismaService.place.findUnique.mockResolvedValue(mockPlaces[0]);
      await service.update('1', updatedData);

      expect(cloudinary.deleteImage).not.toHaveBeenCalled();
      expect(cloudinary.uploadImage).not.toHaveBeenCalled();
      expect(prisma.place.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updatedData,
      });
    });

    it('deve atualizar um local existente com novas imagens, excluindo as antigas', async () => {
      const updatedData = { name: 'Updated Name' };
      const newImagesBuffer = [Buffer.from('new image')];
      mockPrismaService.place.findUnique.mockResolvedValue(mockPlaces[0]);
      mockCloudinaryService.uploadImage.mockResolvedValue(mockImageObject);
      
      await service.update('1', updatedData, newImagesBuffer);

      // Verificar se as imagens antigas foram excluídas
      const oldImages = mockPlaces[0].images as ImageObject[];
      expect(cloudinary.deleteImage).toHaveBeenCalledTimes(oldImages.length);
      expect(cloudinary.deleteImage).toHaveBeenCalledWith(oldImages[0].public_id);
      
      // Verificar se as novas imagens foram enviadas
      expect(cloudinary.uploadImage).toHaveBeenCalledWith(newImagesBuffer[0]);
      
      // Verificar se a atualização foi chamada com os novos dados de imagem
      expect(prisma.place.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          ...updatedData,
          images: JSON.parse(JSON.stringify([mockImageObject])),
        },
      });
    });

    it('deve lançar BadRequestException se o local a ser atualizado não for encontrado', async () => {
      mockPrismaService.place.findUnique.mockResolvedValue(null);
      await expect(service.update('non-existent-id', {})).rejects.toThrow(BadRequestException);
    });
  });

  // --- Casos de Teste para delete ---
  describe('delete', () => {
    it('deve excluir um local e suas imagens', async () => {
      mockPrismaService.place.findUnique.mockResolvedValue(mockPlaces[0]);
      await service.delete('1');

      // Verificar se as imagens foram excluídas
      const images = mockPlaces[0].images as ImageObject[];
      expect(cloudinary.deleteImage).toHaveBeenCalledTimes(images.length);
      expect(cloudinary.deleteImage).toHaveBeenCalledWith(images[0].public_id);
      
      // Verificar se o local foi excluído do banco de dados
      expect(prisma.place.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('deve lançar BadRequestException se o local a ser excluído não for encontrado', async () => {
      mockPrismaService.place.findUnique.mockResolvedValue(null);
      await expect(service.delete('non-existent-id')).rejects.toThrow(BadRequestException);
    });
  });
});
