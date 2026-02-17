import { Sequelize } from "sequelize";
import enc from "dotenv";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "mysql",
  },
);

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
