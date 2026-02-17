import { DataTypes } from "sequelize";
import db from "../../../conn/db.js";

const AlunoResponsavel = db.define("aluno_responsavel", {
  aluno_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  usuario_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
});

export default AlunoResponsavel;
