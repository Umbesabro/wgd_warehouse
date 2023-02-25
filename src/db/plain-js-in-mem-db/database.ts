import { Product } from '../entity/product';

export class Database {
  private readonly products: { [key: string]: Product } = {};
  private id: number = -1;
  saveProduct(product: Product): Product {
    if (product.id === undefined) {
      product.id = ++this.id;
    }
    this.products[product.id] = product;
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
