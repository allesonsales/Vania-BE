import { Sequelize } from "sequelize";
import env from "dotenv";

const sequelize = new Sequelize(process.env.MYSQL_PUBLIC_URL, {
  host: process.env.DB_URL,
  dialect: "mysql",
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
