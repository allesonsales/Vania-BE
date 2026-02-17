import { DataTypes } from "sequelize";
import db from "../../conn/db.js";

const ModeloVan = db.define("modelo_van", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  marca_id: { type: DataTypes.INTEGER, allowNull: false },
  modelo: { type: DataTypes.STRING, allowNull: false, unique: true },
});

export default ModeloVan;

/*
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (1, 'Sprinter 311', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (1, 'Sprinter 415', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (1, 'Sprinter 517', now(), now());

-- Volkswagen
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (2, 'Kombi Escolar', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (2, 'Crafter 2.0', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (2, 'Delivery Express', now(), now());

-- Fiat
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (3, 'Ducato Minibus', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (3, 'Ducato Multi', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (3, 'Scudo', now(), now());

-- Renault
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (4, 'Master Minibus', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (4, 'Master Vitré', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (4, 'Trafic Passenger', now(), now());

-- Ford
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (5, 'Transit Minibus', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (5, 'Transit Escolar', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (5, 'Transit Van', now(), now());

-- Iveco
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (6, 'Daily Minibus', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (6, 'Daily Escolar', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (6, 'Daily City', now(), now());

-- Peugeot
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (7, 'Boxer Minibus', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (7, 'Boxer Escolar', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (7, 'Expert Passenger', now(), now());

-- Citroën
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (8, 'Jumper Minibus', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (8, 'Jumper Escolar', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (8, 'Jumpy Passenger', now(), now());
*/
