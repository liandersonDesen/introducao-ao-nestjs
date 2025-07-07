import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common';
const Porta = process.env.PORT
  console.log(`http://localhost:${Porta}`)
  
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('API de Users')
  .setDescription('Documentação da API de usuários com NestJS + Prisma + Swagger')
  .setVersion('1.0')
  .addTag('users')
  .addBearerAuth({// Esquema JWT Bearer
    type:'http',
    scheme:'bearer',
    bearerFormat:'JWT',
    name:'Authorization',
    in:'heaher'
  })
  .build() // Construir a configuração
  
  const document = SwaggerModule.createDocument(app,config)

  SwaggerModule.setup('api',app,document)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true, //Remova propriedades não decoradas no DTO
      forbidNonWhitelisted: true, // Retorna erro se enviar propriedades não permitidas 
      transform: true, // Transforma os tipos automaticamente Ex:(string -> number) 
    })
  )

  await app.listen( Porta ?? 3000);

}
bootstrap();
