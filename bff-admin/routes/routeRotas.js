import express from "express";
import { RotaController } from "../controller/RotaController.js";
import autenticarUsuario from "../../domain/utils/token/autenticarUsuario.js";

const RotasRoutes = express.Router();

RotasRoutes.post("/", autenticarUsuario, RotaController.cadastrarRota);
RotasRoutes.get("/", autenticarUsuario, RotaController.buscarRotas);
RotasRoutes.post(
  "/turnoEscola",
  autenticarUsuario,
  RotaController.buscarRotaPorTurnoeId,
);
RotasRoutes.get("/:rotaId", autenticarUsuario, RotaController.buscarRota);
RotasRoutes.put("/:rotaId", autenticarUsuario, RotaController.editarRota);
RotasRoutes.delete("/:rotaId", autenticarUsuario, RotaController.excluirRota);

export default RotasRoutes;
