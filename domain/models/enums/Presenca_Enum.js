import { DataTypes } from "sequelize";
import db from "../../../conn/db.js";

const PresencaEnum = db.define(
  "presenca_enum",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descricao: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    timestamps: true,
  },
);

export default PresencaEnum;
