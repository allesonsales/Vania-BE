import { DataTypes } from "sequelize";
import db from "../../conn/db.js";

const Presenca = db.define("presenca", {
  aluno_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  viagem_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  presenca: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

export default Presenca;
