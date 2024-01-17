"use strict";
import { Model } from "sequelize";

import { ReferenceAttributes } from "./Atterbuites/Reference";


module.exports = (sequelize:any, DataTypes:any) => {
  class Reference
  extends Model<ReferenceAttributes> implements ReferenceAttributes {
  
    id!: number;
    site!: string;
    dns!: string;
    basic_price!: number;
    premuim_price!: number;
    gold_price!: number;
    language!: string;
    created_at!: Date;
    updated_at!: Date;


    static associate(models:any) {
      // define association here
    }
  }
  Reference.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    site:{
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://www.example.com",
    },
    dns:{
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "www.example.com",
    },
    basic_price:{
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    premuim_price:{
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,

    },
    gold_price:{
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,

    },
    created_at:{
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: false,
    },
    updated_at:{
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: false,

    }
  }, {
    sequelize,
    modelName: 'reference',
  });
  return Reference;
};