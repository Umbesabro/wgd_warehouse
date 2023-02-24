import { Injectable } from '@nestjs/common';
import { DatabaseServiceAPI } from '../database-service-api';
import { Product } from '../entity/product';
import { Database } from './database';

@Injectable()
export class JsDatabase implements DatabaseServiceAPI {
  private readonly database: Database = new Database();

  insertProduct(product: Product): Product {
    return this.database.insertProduct(product);
  }
  getProduct(id: string): Product {
    return this.database.getProduct(id);
  }
  getProducts(): Product[] {
    return this.database.getProducts();
  }
}
/*
problem:
how to track dispatched to avoid doubled dispatches - need to persist?
what does dispatch means:
- update order status -> dispatched... no we cannot autmatically dispatch, it needs to be done by an employee



*/ 