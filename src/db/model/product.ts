import { DataTypes, Model } from 'sequelize';

export interface ProductAttributes {
  id: number;
  name: string;
  qty: number;
}

export class Product
  extends Model<ProductAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public qty!: number;

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  public static initModel(sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        qty: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        tableName: 'products',
        sequelize,
      },
    );
  }
}
