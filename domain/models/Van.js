import { DataTypes } from "sequelize";
import db from "../../conn/db.js";

const Van = db.define("Van", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  renavam: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  placa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  marca_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  modelo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lugares: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Van;
