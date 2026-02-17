import express from "express";
import { AdminViagemController } from "../controller/AdminViagemController.js";
import autenticarUsuario from "../../domain/utils/token/autenticarUsuario.js";

const AdminViagensRoute = express.Router();

AdminViagensRoute.get(
  "/",
  autenticarUsuario,
  AdminViagemController.consultarViagensUsuario,
);
AdminViagensRoute.get(
  "/:id",
  autenticarUsuario,
  AdminViagemController.consultarViagem,
);

export default AdminViagensRoute;
