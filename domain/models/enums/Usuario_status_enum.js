import { DataTypes } from "sequelize";
import db from "../../../conn/db.js";

const UsuarioStatusEnum = db.define(
  "usuario_status_enum",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    timestamps: true,
  },
);

export default UsuarioStatusEnum;
/*
0 - Inativo
1 - Ativo
 */

/*
insert into usuario_status_enums (tipo, createdAt, updatedAt) value ("Inativo", now(), now());
insert into usuario_status_enums (tipo, createdAt, updatedAt) value ("Ativo", now(), now());
*/
