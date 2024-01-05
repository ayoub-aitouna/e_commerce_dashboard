"use strict";
import { Model } from "sequelize";

interface PurchasesAttributes {
  id: number;
  product_id: number;
  Costumer_id: number;
  created_at: Date;
  updated_at: Date;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class purchases
    extends Model<PurchasesAttributes>
    implements PurchasesAttributes
  {
    id!: number;
    product_id!: number;
    Costumer_id!: number;
    created_at!: Date;
    updated_at!: Date;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  purchases.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "Product",
          key: "id",
        },
      },
      Costumer_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "Costumers",
          key: "id",
        },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "purchases",
    }
  );
  return purchases;
};
