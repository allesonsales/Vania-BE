import { DataTypes } from "sequelize";
import db from "../../conn/db.js";

const Contrato = db.define("contrato", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  responsavel_id: { type: DataTypes.INTEGER, allowNull: false },
  tempo_contrato: { type: DataTypes.INTEGER, allowNull: false },
  inicio: { type: DataTypes.DATE, allowNull: false },
  previsao_fim: { type: DataTypes.DATE, allowNull: false },
  link: { type: DataTypes.STRING, allownull: false },
  valor_mensalidade: { type: DataTypes.INTEGER, allowNull: false },
  dia_vencimento: { type: DataTypes.INTEGER, allowNull: false },
});

export default Contrato;
