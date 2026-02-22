import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const DB_URL =
  process.env.NODE_ENV === "production"
    ? process.env.MYSQL_PUBLIC_URL
    : process.env.LC_PUBLIC_URL;

const sequelize = new Sequelize(DB_URL, {
  dialect: "mysql",
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
});

async function conectarBanco() {
  try {
    await sequelize.authenticate();
    console.log("Banco de dados conectado");
  } catch (err) {
    console.log("Erro ao conectar no banco", err);
  }
}

conectarBanco();

export default sequelize;
