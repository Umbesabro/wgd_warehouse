import { Product } from '../entity/product';

export class Database {
  private readonly products: { [key: string]: Product } = {};

  insertProduct(product: Product): Product {
    if (this.products[product.id]) {
      this.products[product.id].qty += product.qty;
    } else {
      this.products[product.id] = product;
    }
    return this.products[product.id];
  }

  getProducts(): Product[] {
    return Object.keys(this.products).map(
      (productId) => this.products[productId],
    );
  }

  getProduct(id: string): Product {
    return this.products[id];
  }
}
