import { Logger } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { Model, Sequelize } from 'sequelize';
import { ProductDto } from '../dto/product.dto';
import { Product } from './model/product';

@Injectable()
export class PsqlDatabase {
  private readonly logger = new Logger(PsqlDatabase.name);
  constructor(@Inject('SEQUELIZE') private readonly sequelize: Sequelize) {
    this.initDatabase();
  }

  private initDatabase() {
    this.logger.log('Initilizing database connection...');
    Product.initModel(this.sequelize);
    this.sequelize.sync();
    this.logger.log('Database connection initilized successfuly');
  }

  save<T extends Model>(model: T): void {
    try {
      model.save();
    } catch (err) {
      this.logger.error(`Failed to save ${JSON.stringify(model)}`);
    }
  }

  createProduct(productDto: ProductDto): Promise<Product> {
    return Product.create(productDto);
  }

  findOneById(id: number): Promise<Product> {
    console.log(id);
    return Product.findOne({ where: { id } });
  }
}
