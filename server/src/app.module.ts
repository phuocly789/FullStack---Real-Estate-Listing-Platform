import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertiesModule } from './modules/properties/properties.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    PropertiesModule,
    UsersModule,
    AuthModule,
    ContactsModule,
    FavoritesModule,
   
  ],
  controllers: [AppController],
  providers: [AppService,PrismaService],
  exports: [PrismaService], // Export PrismaService for use in other modules
})
export class AppModule {}