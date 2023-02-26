import { ProductDto } from 'src/dto/product.dto';

export class Product {
  id: number;
  name: string;
  qty: number;

  static fromDto(productDto: ProductDto): Product {
    return { ...productDto };
  }
}
