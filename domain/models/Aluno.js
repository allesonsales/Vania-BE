import { DataTypes } from "sequelize";
import db from "../../conn/db.js";

const Aluno = db.define("Aluno", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome: { type: DataTypes.STRING, allowNull: false },
  data_nascimento: { type: DataTypes.DATE, allowNull: false },
  rg: { type: DataTypes.STRING, allowNull: false, unique: true },
  tipo_sanguineo: { type: DataTypes.STRING, allowNull: true },
  endereco_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  escola_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: { type: DataTypes.INTEGER, allowNull: false },
});

export default Aluno;

// id: number;
// nome: string;
// dataNascimento: string;
// rg: string;
// valor: number;
// tipoSanguineo: string;
// responsaveis: number[];
// endereco: Endereco;
// rota: Rota;
// status: number;
