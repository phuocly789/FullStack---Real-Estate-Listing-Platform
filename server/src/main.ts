// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Starting NestJS application...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3000);
  console.log('Application is running on port 3000');
  // main.ts
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Internal Server Error', message: err.message });
});
}
bootstrap();