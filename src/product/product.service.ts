import { Injectable, Logger } from '@nestjs/common';
import { Product } from '../db/model/product';
import { PsqlDatabase } from '../db/psql-database.service';
import { ProductDto } from '../dto/product.dto';
import { SalesOrderDto } from '../dto/sales-order.dto';
import { EventLogClient } from '../event-log-client/sales/event-log-client';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly eventLogClient: EventLogClient,
    private readonly psqlDatabase: PsqlDatabase,
  ) {}

  async dispatchProducts(salesOrderDto: SalesOrderDto) {
    if (await this.isOnStock(salesOrderDto)) {
      const updates = salesOrderDto.positions.map(async (pos) => {
        const product: Product = await this.psqlDatabase.findOneById(pos.productId);
        product.qty -= pos.quantity;
        await this.psqlDatabase.update(product);
      });
      await Promise.all(updates);
      this.eventLogClient.dispatchSuccessful(salesOrderDto);
    } else {
      this.logger.error(`Cannot dispatch order ${salesOrderDto.id} due to missing products on stock`);
      this.eventLogClient.dispatchFailed(salesOrderDto);
    }
  }

  async addProduct(productDto: ProductDto) {
    const productOnStock = await Product.findOne({ where: { id: productDto.id } });
    if (!productOnStock) {
      this.psqlDatabase.createProduct(productDto);
    } else {
      productOnStock.qty += productDto.qty;
      await this.psqlDatabase.update(productOnStock);
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
