import express from "express";
import { AlunoController } from "../controller/AlunoController.js";
import autenticarUsuario from "../../domain/utils/token/autenticarUsuario.js";

const AlunosRoutes = express.Router();

AlunosRoutes.get("/:id", autenticarUsuario, AlunoController.visualizarAluno);
AlunosRoutes.delete("/:id", autenticarUsuario, AlunoController.excluirAluno);
AlunosRoutes.put("/:id", autenticarUsuario, AlunoController.editarAluno);
AlunosRoutes.post("/", autenticarUsuario, AlunoController.cadastrarAluno);
AlunosRoutes.get("/", autenticarUsuario, AlunoController.buscarAlunos);

export default AlunosRoutes;
