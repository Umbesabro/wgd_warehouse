import { Injectable } from '@nestjs/common';
import { Message } from 'amqp-ts';
import { ProductDto } from 'src/dto/product.dto';
import { SalesOrderDto } from 'src/dto/sales-order.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class QueueService {
  constructor(private readonly productService: ProductService) {}

  async dispatchProducts(salesOrderMsg: Message) {
    try {
      const { payload } = salesOrderMsg.getContent();
      const salesOrderDto: SalesOrderDto = JSON.parse(payload);
      await this.productService.dispatchProducts(salesOrderDto);
      salesOrderMsg.ack(false);
    } catch (err) {
      console.error(`Failed to process message ${JSON.stringify(salesOrderMsg)}`, err);
    }
  }

  async addProduct(productMsg: Message) {
    try {
      const { payload } = productMsg.getContent();
      const productDto: ProductDto = JSON.parse(payload);
      await this.productService.addProduct(productDto);
      productMsg.ack(false);
    } catch (err) {
      console.error(`Failed to process message ${JSON.stringify(productMsg)}`, err);
    }
  }
}
