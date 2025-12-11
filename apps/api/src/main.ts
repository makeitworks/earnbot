import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


process.on('warning', (warning) => {
  console.warn('Warning captured:', warning.name, warning.message);
  console.warn(warning.stack);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
}
bootstrap();
