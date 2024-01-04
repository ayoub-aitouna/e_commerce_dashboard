'use strict';
import { Model, UUIDV4 } from 'sequelize';

enum IpTvType {
  Basic = "basic",
  Premium = "premium"
}

interface ProductAttributes {
  id: string
  iptv_url: string,
  type: IpTvType,
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Product extends Model<ProductAttributes> implements ProductAttributes {
    id !: string;
    iptv_url !: string;
    type!: IpTvType;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    iptv_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(...Object.values(IpTvType)),
      defaultValue: IpTvType.Basic,
      allowNull: false
    }

  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};