import { DataTypes } from "sequelize";
import db from "../../../conn/db.js";

const RotaEscola = db.define("rota_escolas", {
  rota_id: { type: DataTypes.INTEGER, allowNull: false },
  escola_id: { type: DataTypes.INTEGER, allowNull: false },
  horario_previsto: { type: DataTypes.TIME, allowNull: false },
});

export default RotaEscola;
