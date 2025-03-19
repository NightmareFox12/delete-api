import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connection } from './models/mysql';
import { initializeFirebase } from './models/firebase';

async function bootstrap() {
  //init mysql
  try {
    await connection();
  } catch (err) {
    console.error('\x1b[31m', `Error connecting with MySQL... ${err}`);
  }

  //init firebase
  try {
    initializeFirebase();
  } catch (err) {
    console.error('\x1b[31m', `Error connecting with Firebase... ${err}`);
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
