import express from "express";
import autenticarUsuario from "../../domain/utils/token/autenticarUsuario.js";
import { viagemController } from "../controller/viagemController.js";

const ViagensRoutes = express.Router();

ViagensRoutes.get(
  "/ativa",
  autenticarUsuario,
  viagemController.verificarViagemAtiva,
);
ViagensRoutes.get(
  "/",
  autenticarUsuario,
  viagemController.consultarViagensDisponiveis,
);
ViagensRoutes.get("/:id", autenticarUsuario, viagemController.selecionarViagem);
ViagensRoutes.put("/:id", autenticarUsuario, viagemController.iniciarViagem);

ViagensRoutes.post("/:id", autenticarUsuario, viagemController.finalizarViagem);

export default ViagensRoutes;
