import express from "express";
import { UsuarioController } from "../controller/UsuarioController.js";
import autenticarUsuario from "../../domain/utils/token/autenticarUsuario.js";
import { PagamentoController } from "../controller/PagamentoController.js";

const FinanceiroRoute = express.Router();

FinanceiroRoute.get(
  "/",
  autenticarUsuario,
  PagamentoController.buscarTodosPagamentos,
);

FinanceiroRoute.patch(
  "/confirmar-pagamentos",
  autenticarUsuario,
  PagamentoController.confirmarPagamentos,
);

FinanceiroRoute.post("/", UsuarioController.cadastrarUsuario);

FinanceiroRoute.delete(
  "/",
  autenticarUsuario,
  UsuarioController.excluirUsuario,
);

FinanceiroRoute.get(
  "/:id",
  autenticarUsuario,
  PagamentoController.buscarPagamentosPorResponsavel,
);
FinanceiroRoute.patch(
  "/:id",
  autenticarUsuario,
  PagamentoController.confirmarPagamento,
);

FinanceiroRoute.patch(
  "/cancelar/:id",
  autenticarUsuario,
  PagamentoController.cancelarPagamento,
);

export default FinanceiroRoute;
