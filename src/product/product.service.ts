import { Injectable, Logger } from '@nestjs/common';
import { ProductDto } from 'src/dto/product.dto';
import { SalesOrderDto } from 'src/dto/sales-order.dto';
import { EventLogClient } from 'src/event-log-client/sales/event-log-client';
import { Product } from '../db/model/product';
import { PsqlDatabase } from '../db/psql-database.service';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private readonly eventLogClient: EventLogClient, private readonly psqlDatabase: PsqlDatabase) {}

  async dispatchProducts(salesOrderDto: SalesOrderDto) {
    if (await this.isOnStock(salesOrderDto)) {
      salesOrderDto.positions.forEach(async (pos) => {
        const product: Product = await this.psqlDatabase.findOneById(pos.productId);
        product.qty -= pos.quantity;
        this.psqlDatabase.save(product);
      });
      this.eventLogClient.dispatchSuccessful(salesOrderDto);
    } else {
      this.logger.log(`Cannot dispatch order ${salesOrderDto.id} due to missing products on stock`);
      this.eventLogClient.dispatchFailed(salesOrderDto);
    }
  }

  async addProduct(product: ProductDto) {
    console.log(product);
    const productOnStock = await Product.findOne({
      where: { id: product.id },
    });
    if (!productOnStock) {
      this.psqlDatabase.createProduct(product);
    } else {
      productOnStock.qty += product.qty;
      this.psqlDatabase.save(productOnStock);
    }
  }

  private async isOnStock(salesOrderDto: SalesOrderDto): Promise<boolean> {
    for (const orderPosition of salesOrderDto.positions) {
      const product = await this.psqlDatabase.findOneById(orderPosition.productId);
      if (product === null || product.qty < orderPosition.quantity) {
        return false;
      }
    }
    return true;
  }
}
