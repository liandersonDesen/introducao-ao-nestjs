import { Test, TestingModule } from "@nestjs/testing";
import { PlaceController } from "./place.controller"
import { PlaceService } from "./place.service"
import { CreatePlaceDto } from "./dto/create-place.dto";
import { UpdatePlaceDto } from "./dto/update-place.dto";
import { CloudinaryService } from "./cloudinary.service";
import { Place, Prisma } from "@prisma/client"
import { BadRequestException } from "@nestjs/common";

const mockPlace:Place[]=[
    { 
        id: "jdjbjbjjdbbbahb",
        name: "Praça Central",
        type: "RESTAURANTE",
        phone: "(88) 99999-9999",
        latitude:-3.7327,
        longitude:38.5267,
        images:[],
        create_at: new Date()
    },
    {
        id:"juytdcvbliuyfcbklitf",
        name: "Praça Central",
        type: "RESTAURANTE",
        phone: "(88) 99999-9999",
        latitude:-3.7327,
        longitude:38.5267,
        images:[],
        create_at: new Date()
    }
]
const mockPlaceServices= {
    findAll: jest.fn().mockResolvedValue(mockPlace),
    findPaginated:jest.fn().mockResolvedValue( {data: mockPlace, total: 2 }),
    create:jest.fn().mockResolvedValue(mockPlace[0]),
    update:jest.fn().mockResolvedValue(mockPlace[0]),
    delete:jest.fn().mockResolvedValue(mockPlace[0])
}
const mockCloudinaryService={
    uploadImage:jest.fn()
}
describe("User Controller Tests", ()=>{
    let controller :PlaceController;
    let placeService: jest.Mocked<PlaceService>;
    let cloudinary: jest.Mocked<CloudinaryService>;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers:[PlaceController],
            providers:[
                {provide:PlaceService, useValue:mockPlaceServices},
                {provide:CloudinaryService,useValue:mockCloudinaryService}
            ]
        }).compile();

        controller = module.get<PlaceController>(PlaceController)
        placeService = module.get(PlaceService);
        cloudinary = module.get(CloudinaryService);
        jest.clearAllMocks();   
    })

    it("listar todos os locais",async ()=>{
        const result = await controller.findAll()
        expect(result).toEqual(mockPlace)
        expect(mockPlaceServices.findAll).toHaveBeenCalledWith()
    })

    it("criar local",async ()=>{
        const dto: CreatePlaceDto = {
            name: 'Praça Central',
            type: 'RESTAURANTE',
            phone: '(88) 99999-9999',
            latitude: -3.7327,
            longitude: -38.5267,
        }; 
        const files = { images: [{ buffer: Buffer.from('fake') }] as any };
        mockCloudinaryService.uploadImage.mockResolvedValue({url: "2347890-pokjhvc",public_id: "234567ugvbngfb"})
        const result = await controller.createPlace(dto, files);
        expect(cloudinary.uploadImage).toHaveBeenCalled();
        expect(placeService.create).toHaveBeenCalledWith({
            ...dto,
            images: [],
        });
        expect(result.id).toEqual("jdjbjbjjdbbbahb");
    });

    it('deve lançar BadRequestException se não existir imagem', async () => {      
        const dto: CreatePlaceDto = {
            name: 'Praça Central',
            type: 'RESTAURANTE',
            phone: '(88) 99999-9999',
            latitude: -3.7327,
            longitude: -38.5267,
        }; 
        const files = { images: []};
        await expect(controller.createPlace(dto,files)).rejects.toThrow(BadRequestException);
    });

    it("atualizar local",async ()=>{
        const id_place= "opiuytsa43422340"
        const dto: UpdatePlaceDto = {
            name: 'Praça Central',
            type: 'RESTAURANTE',
        };

    const files = { images: [{ buffer: Buffer.from('nova') }] as any };

    const result = await controller.updatePlace(id_place, dto, files);

    expect(placeService.update).toHaveBeenCalledWith(
        "opiuytsa43422340",
        dto,
        [Buffer.from('nova')]);
    expect(result).toEqual(mockPlace[0]);
  });

  it("deletar local",async ()=>{
    const id_place= "opiuytsa43422340"
    const result = await controller.deletePlace(id_place);
    expect(placeService.delete).toHaveBeenCalledWith("opiuytsa43422340")
    expect(result).toEqual(mockPlace[0]);
  });

  it("paginar locais",async ()=>{
    const result = await controller.findPagineted(1,10);
    expect(placeService.findPaginated).toHaveBeenCalledWith(1,10)
    expect(result).toEqual({data:mockPlace, total:2});
  });
  

})