import { DataTypes } from "sequelize";
import db from "../../conn/db.js";

const Escola = db.define("escola", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome: { type: DataTypes.STRING, allowNull: false },
  telefone: { type: DataTypes.STRING, allowNull: true, unique: true },
  endereco_id: { type: DataTypes.INTEGER, allowNull: false },
  tipo: { type: DataTypes.INTEGER, allowNull: false },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.INTEGER, allowNull: false },
});

export default Escola;
