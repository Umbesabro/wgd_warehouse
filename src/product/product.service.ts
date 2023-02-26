import { Injectable } from '@nestjs/common';
import { JsDatabase } from 'src/db/plain-js-in-mem-db/js-database';
import { ProductDto } from 'src/dto/product.dto';
import { SalesOrderDto } from 'src/dto/sales-order.dto';
import { EventLogClient } from 'src/event-log-client/sales/event-log-client';

@Injectable()
export class ProductService {
  constructor(
    private readonly jsDatabase: JsDatabase,
    private readonly eventLogClient: EventLogClient,
  ) {}

  dispatchProducts(salesOrderDto: SalesOrderDto) {
    if (this.isOnStock(salesOrderDto)) {
      salesOrderDto.positions.forEach((pos) => {
        const product = this.jsDatabase.getProduct(pos.productId);
        product.qty -= pos.quantity;
        this.jsDatabase.saveProduct(product);
      });
      this.eventLogClient.dispatchSuccessful(salesOrderDto);
    } else {
      console.log(
        `Cannot dispatch order ${salesOrderDto.id} due to missing products on stock`,
      );
      this.eventLogClient.dispatchFailed(salesOrderDto);
    }
  }

  addProduct(product: ProductDto) {
    const productOnStock = this.jsDatabase.getProduct(product.id);
    if (!productOnStock) {
      this.jsDatabase.saveProduct(product);
    } else {
      productOnStock.qty += product.qty;
      this.jsDatabase.saveProduct(productOnStock);
    }
  }

  private isOnStock(salesOrderDto: SalesOrderDto): boolean {
    for (const orderPosition of salesOrderDto.positions) {
      const product = this.jsDatabase.getProduct(orderPosition.productId);
      if (product === undefined || product.qty < orderPosition.quantity) {
        return false;
      }
    }
    return true;
  }
}
