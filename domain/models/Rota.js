import { DataTypes } from "sequelize";
import db from "../../conn/db.js";

const Rota = db.define("rota", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  nome: { type: DataTypes.STRING, allowNull: false },
  partida_id: { type: DataTypes.INTEGER, allowNull: false },
  van_id: { type: DataTypes.INTEGER, allowNull: false },
  motorista_id: { type: DataTypes.INTEGER, allowNull: false },
  escola_id: { type: DataTypes.INTEGER, allowNull: false },
  hora_inicio_ida: { type: DataTypes.TIME, allowNull: false },
  hora_fim_ida: { type: DataTypes.TIME, allowNull: false },
  hora_inicio_volta: { type: DataTypes.TIME, allowNull: false },
  hora_fim_volta: { type: DataTypes.TIME, allowNull: false },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.INTEGER, allowNull: false },
});

export default Rota;
