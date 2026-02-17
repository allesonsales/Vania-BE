import express from "express";
import autenticarUsuario from "../../domain/utils/token/autenticarUsuario.js";
import { MotoristaController } from "../controller/motoristaController.js";

const AppMotoristaRoutes = express.Router();

AppMotoristaRoutes.get(
  "/",
  autenticarUsuario,
  MotoristaController.consultarMotorista,
);

export default AppMotoristaRoutes;
