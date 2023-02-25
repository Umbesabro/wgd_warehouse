import { Injectable } from '@nestjs/common';
import { Message } from 'amqp-ts';
import { SalesOrderDto } from 'src/dto/sales-order.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class QueueService {
  constructor(private readonly productService: ProductService) {}

  dispatchProducts(salesOrderMsg: Message) {
    try {
      const { payload } = salesOrderMsg.getContent();
      const salesOrderDto: SalesOrderDto = JSON.parse(payload);
      this.productService.dispatchProducts(salesOrderDto);
    } catch (err) {
      console.error(
        `Failed to process message ${JSON.stringify(salesOrderMsg)}`,
        err,
      );
    }
  }
}
