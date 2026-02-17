import { DataTypes } from "sequelize";
import db from "../../../conn/db.js";

const PagamentoStatusEnum = db.define(
  "pagamento_status_enum",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descricao: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    timestamps: true,
  },
);

export default PagamentoStatusEnum;

/* 
0 - Não pago
1 - Pago
2 - Vencido
 */

/* 
insert into pagamento_status_enums (descricao, createdAt, updatedAt) values ("Não Pago", now(), now());
insert into pagamento_status_enums (descricao, createdAt, updatedAt) values ("Pago", now(), now());
insert into pagamento_status_enums (descricao, createdAt, updatedAt) values ("Vencido", now(), now());
 */
