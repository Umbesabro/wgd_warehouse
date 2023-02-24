import { Product } from './entity/product';

export interface DatabaseServiceAPI {
  insertProduct(product: Product): Product;
  getProduct(id: string): Product;
  getProducts(): Product[];
}
