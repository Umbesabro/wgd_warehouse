import { Module } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PsqlDatabase } from './db/psql-database.service';
import { EventLogClient } from './event-log-client/sales/event-log-client';
import { ProductService } from './product/product.service';
import { QueueReader } from './queue/queue-reader';
import { QueueService } from './queue/queue.service';

const SEQUELIZE = 'SEQUELIZE';
const sequelizeProvider = {
  provide: SEQUELIZE,
  useValue: new Sequelize(
    'wgd_warehouse',
    process.env.WGD_PSQL_USER,
    process.env.WGD_PSQL_PW,
    {
      host: 'localhost',
      dialect: 'postgres',
      port: 5432,
      logging: true,
    },
  ),
};

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    ProductService,
    EventLogClient,
    QueueService,
    QueueReader,
    PsqlDatabase,
    sequelizeProvider,
  ],
})
export class AppModule {}
