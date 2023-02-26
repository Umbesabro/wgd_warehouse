import { ProductDto } from 'src/dto/product.dto';
import { Product } from './entity/product';

export interface DatabaseServiceAPI {
  saveProduct(product: ProductDto): Product;
  getProduct(id: number): Product;
  getProducts(): Product[];
}
