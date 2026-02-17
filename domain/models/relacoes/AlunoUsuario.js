import { DataTypes } from "sequelize";
import db from "../../../conn/db.js";

const AlunoUsuario = db.define("aluno_usuario", {
  aluno_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  usuario_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
});

export default AlunoUsuario;
