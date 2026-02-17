import { DataTypes } from "sequelize";
import db from "../../../conn/db.js";

const UsuarioEnum = db.define(
  "usuario_enum",
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

export default UsuarioEnum;
/*
1 - Admin
2 - Motorista
3 - Responsável
 */

/*
insert into usuario_enums (tipo, createdAt, updatedAt) value ("Admin", now(), now());
insert into usuario_enums (tipo, createdAt, updatedAt) value ("Motorista", now(), now());
insert into usuario_enums (tipo, createdAt, updatedAt) value ("Responsável", now(), now());
*/
