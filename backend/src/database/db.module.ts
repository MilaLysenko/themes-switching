import { Module } from '@nestjs/common';
import { databaseProviders } from './db.providers';

@Module({
  components: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
