import { Op, Sequelize } from "sequelize";
import Pagamento from "../../domain/models/Pagamento.js";
import consultarConfiguracao from "../../domain/utils/configuracao/consultarConfiguracao.js";
import Usuario from "../../domain/models/Usuario.js";
import AlunoResponsavel from "../../domain/models/relacoes/AlunoResponsavel.js";
import Aluno from "../../domain/models/Aluno.js";
import Escola from "../../domain/models/Escola.js";
import RotaAluno from "../../domain/models/relacoes/RotaAluno.js";
import Rota from "../../domain/models/Rota.js";
import sequelize from "../../conn/db.js";

export class PagamentoController {
  static async criarPagamentos(req, res) {
    const usuarioId = req.usuario.id;

    let configuracao;
    try {
      configuracao = await consultarConfiguracao;

      if (!configuracao) {
        return res
          .status(400)
          .json({ message: "Configuração de usuário, não encontrada!" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar configurações" });
    }
  }

  static async buscarTodosPagamentos(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const { mes, ano } = req.query;

      const pagamentos = await Pagamento.findAll({
        where: {
          usuario_id: usuarioId,
          status: { [Op.ne]: 0 },
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("MONTH", Sequelize.col("data_vencimento")),
              mes,
            ),
            Sequelize.where(
              Sequelize.fn("YEAR", Sequelize.col("data_vencimento")),
              ano,
            ),
          ],
        },
        include: [
          {
            model: Usuario,
            as: "responsavel",
            include: [
              {
                model: AlunoResponsavel,
                as: "Alunoresponsavel",
                include: [
                  {
                    model: Aluno,
                    as: "aluno",
                    include: [
                      {
                        model: RotaAluno,
                        as: "rotasAluno",
                        include: [
                          {
                            model: Rota,
                            as: "rota",
                            include: [{ model: Escola, as: "escola" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      const estimativa =
        (await Pagamento.sum("valor", {
          where: {
            usuario_id: usuarioId,
            status: { [Op.ne]: 0 },
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn("MONTH", Sequelize.col("data_vencimento")),
                mes,
              ),
              Sequelize.where(
                Sequelize.fn("YEAR", Sequelize.col("data_vencimento")),
                ano,
              ),
            ],
          },
        })) || 0;

      const recebido =
        (await Pagamento.sum("valor", {
          where: {
            usuario_id: usuarioId,
            status: { [Op.eq]: 2 },
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn("MONTH", Sequelize.col("data_vencimento")),
                mes,
              ),
              Sequelize.where(
                Sequelize.fn("YEAR", Sequelize.col("data_vencimento")),
                ano,
              ),
            ],
          },
        })) || 0;

      const atrasado =
        (await Pagamento.sum("valor", {
          where: {
            usuario_id: usuarioId,
            status: { [Op.eq]: 3 },
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn("MONTH", Sequelize.col("data_vencimento")),
                mes,
              ),
              Sequelize.where(
                Sequelize.fn("YEAR", Sequelize.col("data_vencimento")),
                ano,
              ),
            ],
          },
        })) || 0;

      const listaPagamento = pagamentos.map((pagamento) => ({
        id: pagamento.id,

        aluno: {
          id: pagamento.responsavel?.Alunoresponsavel?.[0]?.aluno.id,
          nome: pagamento.responsavel?.Alunoresponsavel?.[0]?.aluno.nome,
          escola: {
            nome: pagamento.responsavel?.Alunoresponsavel?.[0]?.aluno
              .rotasAluno?.[0].rota.escola.nome,
            id: pagamento.responsavel?.Alunoresponsavel?.[0]?.aluno
              .rotasAluno?.[0].rota.escola.id,
            telefone:
              pagamento.responsavel?.Alunoresponsavel?.[0]?.aluno
                .rotasAluno?.[0].rota.escola.telefone,
          },
        },
        responsavel: {
          id: pagamento.responsavel.id,
          cpf: pagamento.responsavel.cpf,
          nome: pagamento.responsavel.nome,
          email: pagamento.responsavel.email,
          telefone: pagamento.responsavel.telefone,
        },
        valor: pagamento.valor,
        vencimento: pagamento.data_vencimento,
        status: pagamento.status,
      }));

      return res
        .status(200)
        .json({ listaPagamento, estimativa, recebido, atrasado });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar pagamento", status: "error" });
    }
  }

  static async buscarPagamentosPorResponsavel(req, res) {
    const responsavelId = req.params.id;

    try {
      const pagamentos = await Pagamento.findAll({
        where: { responsavel_id: responsavelId, status: { [Op.ne]: 0 } },
        include: [
          {
            model: Usuario,
            as: "responsavel",
            include: [
              {
                model: AlunoResponsavel,
                as: "Alunoresponsavel",
                include: [
                  {
                    model: Aluno,
                    as: "aluno",
                    include: [
                      {
                        model: RotaAluno,
                        as: "rotasAluno",
                        include: [
                          {
                            model: Rota,
                            as: "rota",
                            include: [{ model: Escola, as: "escola" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      const responsavel = {
        id: pagamentos[0].responsavel.id,
        nome: pagamentos[0].responsavel.nome,
        email: pagamentos[0].responsavel.email,
        telefone: pagamentos[0].responsavel.telefone,
      };

      const pagamentoFlat = pagamentos.map((pagamento) => ({
        id: pagamento.id,
        vencimento: pagamento.data_vencimento,
        valor: pagamento.valor,
        status: pagamento.status,
        pago_em: pagamento.pago_em,
        tipo_pagameto: pagamento.tipo_pagamento,
        aluno: {
          id: pagamento.responsavel.Alunoresponsavel[0].aluno.id,
          nome: pagamento.responsavel.Alunoresponsavel[0].aluno.nome,
          data_nascimento:
            pagamento.responsavel.Alunoresponsavel[0].aluno.data_nascimento,
          rg: pagamento.responsavel.Alunoresponsavel[0].aluno.rg,
          escola: {
            id: pagamento.responsavel.Alunoresponsavel[0].aluno.rotasAluno[0]
              .rota.escola.id,
            nome: pagamento.responsavel.Alunoresponsavel[0].aluno.rotasAluno[0]
              .rota.escola.nome,
            telefone:
              pagamento.responsavel.Alunoresponsavel[0].aluno.rotasAluno[0].rota
                .escola.telefone,
          },
        },
        responsavel: {
          id: pagamentos[0].responsavel.id,
          nome: pagamentos[0].responsavel.nome,
          email: pagamentos[0].responsavel.email,
          cpf: pagamentos[0].responsavel.cpf,
          telefone: pagamentos[0].responsavel.telefone,
        },
      }));

      return res.status(200).json(pagamentoFlat);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar pagamento!", status: "error" });
    }
  }

  static async confirmarPagamento(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const pagamentoId = req.params.id;
      const { status, pago_em } = req.body;

      const pagamento = await Pagamento.findOne({
        where: { id: pagamentoId },
      });

      await pagamento.update({ status, pago_em });

      console.log("chegou aqui");

      return res.status(200).json({
        message: "Pagamento atualizado com sucesso!",
        status: "success",
      });
    } catch (err) {
      console.error(err);
    }
  }

  static async cancelarPagamento(req, res) {
    try {
      const pagamentoId = req.params.id;
      const dataAtual = new Date();

      const pagamento = await Pagamento.findOne({
        where: { id: pagamentoId },
      });

      const dataVencimento = new Date(pagamento.data_vencimento);

      console.log(dataVencimento, dataAtual);

      const payload = {
        pago_em: null,
        status: dataVencimento > dataAtual ? 1 : 3,
      };

      await pagamento.update(payload);

      return res.status(200).json({
        message: "Pagamento atualizado com sucesso!",
        status: "success",
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Erro ao atualizar pagamento!", status: "error" });
    }
  }
}
