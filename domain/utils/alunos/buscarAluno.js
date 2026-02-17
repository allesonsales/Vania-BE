import { Op } from "sequelize";
import Aluno from "../../models/Aluno.js";
import AlunoUsuario from "../../models/relacoes/AlunoUsuario.js";
import Endereco from "../../models/Endereco.js";
import AlunoResponsavel from "../../models/relacoes/AlunoResponsavel.js";
import Usuario from "../../models/Usuario.js";
import RotaAluno from "../../models/relacoes/RotaAluno.js";
import Rota from "../../models/Rota.js";
import Van from "../../models/Van.js";
import Escola from "../../models/Escola.js";
import ModeloVan from "../../models/Modelo.js";
import Pagamento from "../../models/Pagamento.js";
import Contrato from "../../models/Contrato.js";

async function buscarAluno(alunoId, usuarioId) {
  try {
    const alunoEncontrado = await AlunoUsuario.findOne({
      where: { usuario_id: usuarioId, aluno_id: alunoId },
      include: [
        {
          model: Aluno,
          as: "aluno",
          where: { status: { [Op.ne]: 0 } },
          include: [
            {
              model: Endereco,
              as: "endereco",
              attributes: [
                "cep",
                "rua",
                "numero",
                "bairro",
                "cidade",
                "estado",
              ],
            },
            {
              model: AlunoResponsavel,
              as: "responsavel",
              include: [
                {
                  model: Usuario,
                  as: "responsavel",
                  attributes: ["id", "nome", "cpf", "telefone", "email"],
                  include: [
                    { model: Contrato },
                    { model: Pagamento, as: "pagamentosResponsavel" },
                  ],
                },
              ],
            },
            {
              model: RotaAluno,
              as: "rotasAluno",
              include: [
                {
                  model: Rota,
                  as: "rota",
                  attributes: [
                    "nome",
                    "id",
                    "hora_fim_volta",
                    "hora_inicio_volta",
                    "hora_inicio_ida",
                    "hora_fim_ida",
                  ],
                  include: [
                    {
                      model: Escola,
                      as: "escola",
                      attributes: ["id", "nome", "telefone"],
                      include: [{ model: Endereco, as: "endereco" }],
                    },
                    {
                      model: Van,
                      as: "van",
                      attributes: ["id", "renavam", "placa", "numero"],
                      include: [{ model: ModeloVan, attributes: ["modelo"] }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!alunoEncontrado) return null;

    const aluno = {
      id: alunoEncontrado.aluno.id,
      nome: alunoEncontrado.aluno.nome,
      rg: alunoEncontrado.aluno.rg,
      status: alunoEncontrado.aluno.status,
      data_nascimento: alunoEncontrado.aluno.data_nascimento,
      tipo_sanguineo: alunoEncontrado.aluno.tipo_sanguineo,
      endereco: alunoEncontrado.aluno.endereco,
      responsavel: {
        id: alunoEncontrado.aluno.responsavel.responsavel.id,
        nome: alunoEncontrado.aluno.responsavel.responsavel.nome,
        telefone: alunoEncontrado.aluno.responsavel.responsavel.telefone,
        cpf: alunoEncontrado.aluno.responsavel.responsavel.cpf,
        email: alunoEncontrado.aluno.responsavel.responsavel.email,
      },
      escola: {
        id: alunoEncontrado.aluno.rotasAluno[0].rota.escola.id,
        nome: alunoEncontrado.aluno.rotasAluno[0].rota.escola.nome,
        telefone: alunoEncontrado.aluno.rotasAluno[0].rota.escola.telefone,
        endereco: alunoEncontrado.aluno.rotasAluno[0].rota.escola.endereco,
      },
      rota: {
        id: alunoEncontrado.aluno.rotasAluno[0].rota.id,
        nome: alunoEncontrado.aluno.rotasAluno[0].rota.nome,
        hora_inicio_ida:
          alunoEncontrado.aluno.rotasAluno[0].rota.hora_inicio_ida,
        hora_fim_ida: alunoEncontrado.aluno.rotasAluno[0].rota.hora_fim_ida,
        hora_inicio_volta:
          alunoEncontrado.aluno.rotasAluno[0].rota.hora_inicio_volta,
        hora_fim_volta: alunoEncontrado.aluno.rotasAluno[0].rota.hora_fim_volta,
        van: {
          id: alunoEncontrado.aluno.rotasAluno[0].rota.van.id,
          modelo:
            alunoEncontrado.aluno.rotasAluno[0].rota.van.modelo_van.modelo,
          placa: alunoEncontrado.aluno.rotasAluno[0].rota.van.placa,
          renavam: alunoEncontrado.aluno.rotasAluno[0].rota.van.renavam,
          numero: alunoEncontrado.aluno.rotasAluno[0].rota.van.numero,
        },
      },
      contrato: {
        id: alunoEncontrado.aluno.responsavel.responsavel.contrato.id,
        tempo_contrato:
          alunoEncontrado.aluno.responsavel.responsavel.contrato.tempo_contrato,
        valor_mensalidade:
          alunoEncontrado.aluno.responsavel.responsavel.contrato
            .valor_mensalidade,
        dia_vencimento:
          alunoEncontrado.aluno.responsavel.responsavel.contrato.dia_vencimento,
      },
      pagamentos: alunoEncontrado.aluno.responsavel,
    };

    return aluno;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default buscarAluno;
