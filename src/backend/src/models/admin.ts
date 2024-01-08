"use strict";
import { Model } from "sequelize";
import { AdminAtterbuites } from "./Atterbuites/Admin";


module.exports = (sequelize: any, DataTypes: any) => {
  class admin extends Model<AdminAtterbuites> implements AdminAtterbuites {
    id!: number;
    email!: string;
    password!: string;
    api_token!: string;
    created_at!: Date;
    updated_at!: Date;

    static associate(models: any) {
      // define association here
    }
  }
  admin.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      api_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "admin",
    }
  );
  return admin;
};
