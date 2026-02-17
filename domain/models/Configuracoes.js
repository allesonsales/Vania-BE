import { DataTypes } from "sequelize";
import db from "../../conn/db.js";

const Configuracao = db.define(
  "configuracao",
  {
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    valor_mensalidade: { type: DataTypes.INTEGER, allowNull: false },
    tempo_contrato: { type: DataTypes.INTEGER, allowNull: false },
    dia_padrao_vencimento: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "configuracoes",
    timestamps: true,
  },
);

export default Configuracao;
