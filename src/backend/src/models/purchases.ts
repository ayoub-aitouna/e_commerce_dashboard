"use strict";
import { Model } from "sequelize";
import { PurchasesAttributes } from "./Atterbuites/Purchases";


module.exports = (sequelize: any, DataTypes: any) => {
  class Purchases extends Model<PurchasesAttributes> implements PurchasesAttributes {
    id!: number;
    product_id!: number;
    Costumer_id!: number;
    created_at!: Date;
    updated_at!: Date;

    static associate(models: any) {
      // define association here
    }
  }

  Purchases.init(
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
          model: "products",  // Correct reference to the "products" table
          key: "id",
        },
      },
      Costumer_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "costumers",
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

  return Purchases;
};