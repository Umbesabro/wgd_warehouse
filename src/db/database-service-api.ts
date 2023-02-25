import { Product } from './entity/product';

export interface DatabaseServiceAPI {
  saveProduct(product: Product): Product;
  getProduct(id: number): Product;
  getProducts(): Product[];
}
