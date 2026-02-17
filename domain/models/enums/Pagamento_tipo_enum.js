import { DataTypes } from "sequelize";
import db from "../../../conn/db.js";

const PagamentoTipoEnum = db.define(
  "pagamento_tipo_enum",
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

export default PagamentoTipoEnum;

/*
1 - pix
2 - credito
3 - dinheiro

insert into pagamento_tipo_enums (descricao, createdAt, updatedAt) values ("Pix", now(), now());
insert into pagamento_tipo_enums (descricao, createdAt, updatedAt) values ("Crédito", now(), now());
insert into pagamento_tipo_enums (descricao, createdAt, updatedAt) values ("Dinheiro", now(), now());
*/
