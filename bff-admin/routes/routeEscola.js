import express from "express";
import { EscolaController } from "../controller/EscolaController.js";
import autenticarUsuario from "../../domain/utils/token/autenticarUsuario.js";
import Escola from "../../domain/models/Escola.js";

const EscolasRoutes = express.Router();

EscolasRoutes.get("/tipos", autenticarUsuario, EscolaController.buscarTipos);
EscolasRoutes.get("/", autenticarUsuario, EscolaController.listarEscolas);
EscolasRoutes.post("/", autenticarUsuario, EscolaController.cadastrarEscola);
EscolasRoutes.get("/:id", autenticarUsuario, EscolaController.detalheEscola);
EscolasRoutes.put("/:id", autenticarUsuario, EscolaController.editarEscola);
EscolasRoutes.delete("/:id", autenticarUsuario, EscolaController.deletarEscola);

export default EscolasRoutes;
