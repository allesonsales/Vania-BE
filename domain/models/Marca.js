import { DataTypes } from "sequelize";
import db from "../../conn/db.js";

const MarcaVan = db.define("marca_van", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  marca: { type: DataTypes.STRING, allowNull: false, unique: true },
});

export default MarcaVan;

/*
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Mercedes-Benz", NOW(), NOW());
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Volkswagen", NOW(), NOW());
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Fiat", NOW(), NOW());
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Renault", NOW(), NOW());
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Ford", NOW(), NOW());
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Iveco", NOW(), NOW());
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Peugeot", NOW(), NOW());
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Citroën", NOW(), NOW())
*/
