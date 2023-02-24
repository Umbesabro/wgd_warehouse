import { Injectable } from '@nestjs/common';
import * as Amqp from 'amqp-ts';
import { QueueService } from './queue.service';
import { QUEUES } from './queues';

@Injectable()
export class QueueReader {
  private queues = {};
  private exchanges = {};
  private connection: Amqp.Connection = new Amqp.Connection('amqp://localhost');

  constructor(private readonly queueService: QueueService) {
  }

  subscribeNewSalesOrder(queueName) {
    let queue;
    let exchange;
    if (!this.queues[queueName]) {
      queue = this.connection.declareQueue(queueName);
      exchange = this.connection.declareExchange(queueName);
      queue.bind(exchange);
      this.queues[queueName] = queue;
      this.exchanges[queueName] = exchange;
    } else {
      queue = this.queues[queueName];
      exchange = this.exchanges[queueName];
    }

    queue.activateConsumer((message) =>
    );
  }
}
