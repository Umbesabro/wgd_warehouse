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
    this.subscribeDispatch(QUEUES.WAREHOUSE_DISPATCH_ORDER);
    this.subscribeAddProduct(QUEUES.ADD_PRODUCT);
  }

  subscribeDispatch(queueName) {
    let queue = this.getQueue(queueName);
    queue.activateConsumer((message) =>
      this.queueService.dispatchProducts(message),
    );
  }

  subscribeAddProduct(queueName) {
    let queue = this.getQueue(queueName);
    queue.activateConsumer((message) => this.queueService.addProduct(message));
  }

  private getQueue(queueName) {
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
    return queue;
  }
}
