import { DataTypes } from "sequelize";
import db from "../../conn/db.js";

const Pagamento = db.define("pagamento", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  responsavel_id: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.INTEGER, allowNull: false },
  valor: { type: DataTypes.INTEGER, allowNull: false },
  data_vencimento: { type: DataTypes.DATEONLY, allowNull: false },
  pago_em: { type: DataTypes.DATEONLY, allowNull: true },
  tipo_pagamento: { type: DataTypes.INTEGER, allowNull: true },
});

export default Pagamento;
