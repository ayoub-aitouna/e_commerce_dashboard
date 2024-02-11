"use strict";
import { Model } from "sequelize";

import { ProductAttributes, IpTvType } from "./Atterbuites/Product";


module.exports = (sequelize: any, DataTypes: any) => {
  class Product extends Model<ProductAttributes> implements ProductAttributes {
    id!: number;
    iptv_url!: string;
    extra_iptv_url!: string;
    type!: IpTvType;
    sold!: boolean;
    solded_at?: Date | undefined;
    pendding!: boolean;
    pendding_at?: Date | undefined;
    created_at!: Date;
    updated_at!: Date;

    static associate(models: any) {
      // define association here
      // Product.belongsToMany(models.costumers, { through: "purchases" });
      Product.hasMany(models.purchases, { foreignKey: 'product_id' });
      Product.belongsTo(models.reference);
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
      extra_iptv_url: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(IpTvType)),
        defaultValue: IpTvType.Basic,
        allowNull: false,
      },
      sold: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      solded_at: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true,
      },
      pendding: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      pendding_at: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true,
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
