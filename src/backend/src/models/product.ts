"use strict";
import { Model, UUIDV4 } from "sequelize";

import { ProductAttributes, IpTvType } from "./Atterbuites/Product";


module.exports = (sequelize: any, DataTypes: any) => {
  class Product extends Model<ProductAttributes> implements ProductAttributes {
    id!: number;
    iptv_url!: string;
    type!: IpTvType;
    created_at!: Date;
    updated_at!: Date;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Product.belongsToMany(models.costumers, { through: "purchases" });
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      iptv_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(IpTvType)),
        defaultValue: IpTvType.Basic,
        allowNull: false,
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
      modelName: "product",
    }
  );
  return Product;
};
