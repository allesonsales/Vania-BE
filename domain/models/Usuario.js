import { DataTypes } from "sequelize";
import db from "../../conn/db.js";
import UsuarioEnum from "./enums/Usuario_Enum.js";

const Usuario = db.define("Usuario", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: { type: DataTypes.STRING, allowNull: false },
  nome_fantasia: { type: DataTypes.STRING, allowNull: true },
  data_nascimento: { type: DataTypes.STRING, allowNull: true },
  cpf: { type: DataTypes.STRING, allowNull: false, unique: true },
  telefone: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: true },
  tipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UsuarioEnum,
      key: "id",
    },
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Usuario;
