import { ProductDto } from 'src/dto/product.dto';
import { Product } from '../entity/product';

export class Database {
  private readonly products: { [key: string]: Product } = {};

  saveProduct(productDto: ProductDto): Product {
    const product = Product.fromDto(productDto);
    this.products[product.id] = product;

    console.log(`[Products]
      ${JSON.stringify(this.products)};
    `);

    return this.products[product.id];
  }

  getProducts(): Product[] {
    return Object.keys(this.products).map(
      (productId) => this.products[productId],
    );
  }

  getProduct(id: number): Product {
    return this.products[id];
  }
}
