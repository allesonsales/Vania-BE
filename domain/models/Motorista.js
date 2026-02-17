import { DataTypes } from "sequelize";
import db from "../../conn/db.js";

const Motorista = db.define("motorista", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  usuario_motorista_id: { type: DataTypes.INTEGER, allowNull: false },
  nome: { type: DataTypes.STRING, allowNull: false },
  data_nascimento: { type: DataTypes.DATE, allowNull: false },
  cnh: { type: DataTypes.STRING, allowNull: false, unique: true },
  data_validade_cnh: { type: DataTypes.DATE, allowNull: false },
  tipo_sanguineo: { type: DataTypes.STRING, allowNull: true },
  telefone: { type: DataTypes.STRING, allowNull: false, unique: true },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Motorista;
