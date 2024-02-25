"use strict";
import { Model } from "sequelize";
import { CostumersAttrebues } from "./Atterbuites/Costumers";
import { IpTvType } from "./Atterbuites/Product";


module.exports = (sequelize: any, DataTypes: any) => {
  class Costumers
    extends Model<CostumersAttrebues>
    implements CostumersAttrebues {
    id!: Number;
    Email!: string;
    referenceSite!: string;
    language!: string;
    type!: IpTvType;
    StripPaymentId!: string;
    bought!: boolean;
    bought_at!: Date;
    pendding!: boolean;
    pendding_at!: Date;
    created_at!: Date;
    updated_at!: Date;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      // Costumers.belongsToMany(models.product, { through: "purchases" });
      Costumers.hasMany(models.purchases, { foreignKey: 'Costumer_id' });
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
      bought: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(IpTvType)),
        defaultValue: IpTvType.Basic,
        allowNull: false,
      },
      StripPaymentId:
      {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false,
        unique: true,
      },
      bought_at: {
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
      referenceSite: {
        type: DataTypes.STRING,
        defaultValue: "none",
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING,
        defaultValue: "en",
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
