import { DataTypes } from "sequelize";
import db from "../../../conn/db.js";

const EscolaEnum = db.define(
  "escola_enum",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

export default EscolaEnum;

/*
1 - Creche
2 - Municipal
3 - Estadual
4 - Técnico
3 - Faculdade
 */

/*
insert into escola_enums (tipo, createdAt, updatedAt) value ("Creche", now(), now());
insert into escola_enums (tipo, createdAt, updatedAt) value ("Municipal", now(), now());
insert into escola_enums (tipo, createdAt, updatedAt) value ("Estadual", now(), now());
insert into escola_enums (tipo, createdAt, updatedAt) value ("Técnico", now(), now());
insert into escola_enums (tipo, createdAt, updatedAt) value ("Faculdade", now(), now());
insert into pagamento_status_enums (descricao, createdAt, updatedAt) values ("Não Pago", now(), now());
insert into pagamento_status_enums (descricao, createdAt, updatedAt) values ("Pago", now(), now());
insert into pagamento_status_enums (descricao, createdAt, updatedAt) values ("Vencido", now(), now());
insert into pagamento_tipo_enums (descricao, createdAt, updatedAt) values ("Pix", now(), now());
insert into pagamento_tipo_enums (descricao, createdAt, updatedAt) values ("Crédito", now(), now());
insert into pagamento_tipo_enums (descricao, createdAt, updatedAt) values ("Dinheiro", now(), now());
insert into usuario_enums (tipo, createdAt, updatedAt) value ("Admin", now(), now());
insert into usuario_enums (tipo, createdAt, updatedAt) value ("Motorista", now(), now());
insert into usuario_enums (tipo, createdAt, updatedAt) value ("Responsável", now(), now());
insert into usuario_status_enums (tipo, createdAt, updatedAt) value ("Inativo", now(), now());
insert into usuario_status_enums (tipo, createdAt, updatedAt) value ("Ativo", now(), now());
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Mercedes-Benz", NOW(), NOW());
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Volkswagen", NOW(), NOW());
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Fiat", NOW(), NOW());
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Renault", NOW(), NOW());
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Ford", NOW(), NOW());
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Iveco", NOW(), NOW());
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Peugeot", NOW(), NOW());
INSERT INTO marca_vans (marca, createdAt, updatedAt) VALUES ("Citroën", NOW(), NOW());

-- Volkswagen
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (1, 'Sprinter 311', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (1, 'Sprinter 415', now(), now());
insert into modelo_vans (marca_id, modelo, createdAt, updatedAt) values (1, 'Sprinter 517', now(), now());
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
