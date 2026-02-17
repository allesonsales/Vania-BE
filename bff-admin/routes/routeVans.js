import express from "express";
import { VanController } from "../controller/VanController.js";
import autenticarUsuario from "../../domain/utils/token/autenticarUsuario.js";

const VansRoutes = express.Router();

VansRoutes.get("/marcas", VanController.buscarMarcas);
VansRoutes.get("/marcas/:marcaId", VanController.buscarModelos);
VansRoutes.post("/", autenticarUsuario, VanController.cadastrarVan);
VansRoutes.get("/", autenticarUsuario, VanController.buscarVans);
VansRoutes.get("/:vanId", autenticarUsuario, VanController.buscarVan);
VansRoutes.put("/:vanId", autenticarUsuario, VanController.editarVan);
VansRoutes.delete("/:vanId", autenticarUsuario, VanController.excluirVan);

export default VansRoutes;
