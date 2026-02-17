import { DataTypes } from "sequelize";
import db from "../../../conn/db.js";

const VanUsuario = db.define("van_usuario", {
  van_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  usuario_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
});

export default VanUsuario;
