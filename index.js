import express from "express";
import cors from "cors";
import conn from "./conn/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import "./domain/models/relacoes.js";
import AlunosRoutes from "./bff-admin/routes/routeAlunos.js";
import EscolasRoutes from "./bff-admin//routes/routeEscola.js";
import VansRoutes from "./bff-admin//routes/routeVans.js";
import UsuariosRoute from "./bff-admin//routes/routeUsuario.js";
import RotasRoutes from "./bff-admin//routes/routeRotas.js";
import MotoristaRoutes from "./bff-admin//routes/routeMotorista.js";
import FinanceiroRoute from "./bff-admin/routes/routeFinanceiro.js";
import ViagensRoutes from "./bff-motorista/routes/ViagensRoutes.js";
import AdminViagensRoute from "./bff-admin/routes/routeViagensAdmin.js";
import AppMotoristaRoutes from "./bff-motorista/routes/MotoristaRoutes.js";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "http://localhost:4201",
      "https://van-ia-fe-1xrf.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use("/contratos", express.static(path.join(__dirname, "contratos")));
app.use("/usuarios", UsuariosRoute);
app.use("/financeiro", FinanceiroRoute);
app.use("/alunos", AlunosRoutes);
app.use("/escolas", EscolasRoutes);
app.use("/vans", VansRoutes);
app.use("/rotas", RotasRoutes);
app.use("/motoristas", MotoristaRoutes);
app.use("/app-motorista", AppMotoristaRoutes);
app.use("/viagens", ViagensRoutes);
app.use("/admin-viagens", AdminViagensRoute);
// app.use("/configuracoes", ConfiguracaoRoute);

try {
  conn.sync().then(() => {
    console.log("Servidor rodando com sequelize");
    console.log("Pasta contratos:", path.join(__dirname, "contratos"));
  });
} catch (error) {
  console.log("Erro ao rodar o servidor com sequelize");
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
