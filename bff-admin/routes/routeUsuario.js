import express from "express";
import { UsuarioController } from "../controller/UsuarioController.js";
import autenticarUsuario from "../../domain/utils/token/autenticarUsuario.js";

const UsuariosRoute = express.Router();

UsuariosRoute.get("/me", autenticarUsuario, UsuarioController.pegarUsuario);
UsuariosRoute.post(
  "/verificar-email-primeiro-acesso",
  UsuarioController.verificarEmailPrimeiroAcesso,
);
UsuariosRoute.put(
  "/cadastrar-senha-primeiro-acesso",
  UsuarioController.cadastrarSenhaPrimeiroAcesso,
);
UsuariosRoute.post("/login", UsuarioController.login);
UsuariosRoute.get("/logout", UsuarioController.logout);
UsuariosRoute.post("/", UsuarioController.cadastrarUsuario);
UsuariosRoute.delete("/", autenticarUsuario, UsuarioController.excluirUsuario);
UsuariosRoute.get("/validar", autenticarUsuario, (req, res) => {
  return res.status(200).json({
    autenticado: true,
    usuario: req.usuario,
  });
});

export default UsuariosRoute;
