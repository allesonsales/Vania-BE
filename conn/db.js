import { Sequelize } from "sequelize";

const sequelize = new Sequelize("vania", "root", "123456", {
  host: "localhost",
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
