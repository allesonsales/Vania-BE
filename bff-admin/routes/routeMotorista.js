import express from "express";
import { MotoristaController } from "../controller/MotoristaController.js";
import autenticarUsuario from "../../domain/utils/token/autenticarUsuario.js";

const MotoristaRoutes = express.Router();

MotoristaRoutes.post(
  "/",
  autenticarUsuario,
  MotoristaController.cadastrarMotorista,
);
MotoristaRoutes.get(
  "/",
  autenticarUsuario,
  MotoristaController.buscarMotoristas,
);
MotoristaRoutes.get(
  "/:motoristaId",
  autenticarUsuario,
  MotoristaController.buscarMotorista,
);
MotoristaRoutes.put(
  "/:motoristaId",
  autenticarUsuario,
  MotoristaController.editarMotorista,
);
MotoristaRoutes.delete(
  "/:motoristaId",
  autenticarUsuario,
  MotoristaController.excluirMotorista,
);

export default MotoristaRoutes;
