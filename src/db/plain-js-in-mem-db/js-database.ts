import { Injectable } from '@nestjs/common';
import { DatabaseServiceAPI } from '../database-service-api';
import { Product } from '../entity/product';
import { Database } from './database';

@Injectable()
export class JsDatabase implements DatabaseServiceAPI {
  private readonly database: Database = new Database();

  saveProduct(product: Product): Product {
    return this.database.saveProduct(product);
  }
  getProduct(id: number): Product {
    return this.database.getProduct(id);
  }
  getProducts(): Product[] {
    return this.database.getProducts();
  }
}
