import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JsDatabase } from './db/plain-js-in-mem-db/js-database';
import { EventLogClient } from './event-log-client/sales/event-log-client';
import { ProductService } from './product/product.service';
import { QueueReader } from './queue/queue-reader';
import { QueueService } from './queue/queue.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ProductService, JsDatabase, EventLogClient, QueueService, QueueReader],
})
export class AppModule {}
