import { DataTypes } from "sequelize";
import db from "../../../conn/db.js";

const RotaAluno = db.define("rota_alunos", {
  rota_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  aluno_id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  ordem: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.INTEGER, allowNull: false },
});

export default RotaAluno;
