"use strict";
import { Model } from "sequelize";
import { CostumersAttrebues } from "./Atterbuites/Costumers";


module.exports = (sequelize: any, DataTypes: any) => {
  class Costumers
    extends Model<CostumersAttrebues>
    implements CostumersAttrebues
  {
    id!: Number;
    Email!: string;
    created_at!: Date;
    updated_at!: Date;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Costumers.belongsToMany(models.product, { through: "purchases" });
    }
  }
  Costumers.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      Email: {
        type: DataTypes.STRING,
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
      modelName: "costumers",
    }
  );
  return Costumers;
};