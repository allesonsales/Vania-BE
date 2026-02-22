import { Op, where } from "sequelize";
import conn from "../../conn/db.js";
import Aluno from "../../domain/models/Aluno.js";
import Endereco from "../../domain/models/Endereco.js";
import AlunoUsuario from "../../domain/models/relacoes/AlunoUsuario.js";
import AlunoResponsavel from "../../domain/models/relacoes/AlunoResponsavel.js";
import verificarCampos from "../../domain/utils/verificarCampos.js";
import buscarAluno from "../../domain/utils/alunos/buscarAluno.js";
import buscarLatitude from "../../domain/utils/buscarLatitude.js";
import verificarEndereco from "../../domain/utils/enderecos/verificarEndereco.js";
import consultarResponsavel from "../../domain/utils/responsavel/consultarResponsavel.js";
import criarPagamento from "../../domain/utils/pagamentos/criarPagamentos.js";
import Contrato from "../../domain/models/Contrato.js";
import RotaAluno from "../../domain/models/relacoes/RotaAluno.js";
import Rota from "../../domain/models/Rota.js";
import buscarMaiorOrdem from "../../domain/utils/alunos/buscarMaiorOrdem.js";
import Escola from "../../domain/models/Escola.js";
import Van from "../../domain/models/Van.js";
import Usuario from "../../domain/models/Usuario.js";
import ModeloVan from "../../domain/models/Modelo.js";
import Pagamento from "../../domain/models/Pagamento.js";
import criarContrato from "../../domain/utils/contrato/criarContrato.js";
import calcularPrevisaoFim from "../../domain/utils/contrato/calcularPrevisaoFim.js";
import buscarUsuarioPorId from "../../domain/utils/usuarios/buscarUsuarioPorId.js";
import RotaEscola from "../../domain/models/relacoes/RotaEscola.js";
import Viagem from "../../domain/models/Viagem.js";
import Presenca from "../../domain/models/Presenca.js";

export class AlunoController {
  static async cadastrarAluno(req, res) {
    const usuarioId = req.usuario.id;
    const transaction = await conn.transaction();

    const {
      nome,
      dataNascimento,
      rg,
      tipoSanguineo,
      nomeResponsavel,
      cpfResponsavel,
      dataNascimentoResponsavel,
      telefoneResponsavel,
      emailResponsavel,
      escolaNome,
      escolaId,
      rotaId,
      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado,
      valorMensalidade,
      tempoContrato,
      inicioContrato,
      diaVencimento,
    } = req.body;

    const camposObrigatorios = {
      nome,
      dataNascimento,
      rg,
      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado,
    };

    const endereco = {
      cep: cep,
      rua: rua,
      numero: numero,
      bairro: bairro,
      cidade: cidade,
      estado: estado,
      longitude: null,
      latitude: null,
    };

    const dadosResponsavel = {
      nome: nomeResponsavel,
      cpf: cpfResponsavel,
      data_nascimento: dataNascimentoResponsavel,
      telefone: telefoneResponsavel,
      email: emailResponsavel,
      tipo: 3,
      status: 2,
    };

    try {
      verificarCampos(camposObrigatorios);
    } catch (error) {
      return res.status(400).json({ message: error.message, status: "error" });
    }

    if (!rotaId) {
      return res
        .status(500)
        .json({ message: "Selecione uma rota para o aluno!", status: "error" });
    }
    try {
      const alunoEncontrado = await Aluno.findOne({ where: { rg: rg } });

      const responsavelEncontrado = await consultarResponsavel(
        nomeResponsavel,
        dataNascimentoResponsavel,
        cpfResponsavel,
        telefoneResponsavel,
        emailResponsavel,
        transaction,
      );

      if (alunoEncontrado) {
        return res.status(409).json({
          message: "Aluno já cadastrado no sistema!",
          status: "error",
        });
      }

      const enderecoBuscado = await verificarEndereco(endereco);

      const aluno = {
        nome: nome,
        data_nascimento: dataNascimento,
        rg: rg,
        tipo_sanguineo: tipoSanguineo,
        endereco_id: enderecoBuscado.id,
        escola_id: escolaId,
        status: 1,
      };

      const alunoCriado = await Aluno.create(aluno, { transaction });

      await AlunoUsuario.create(
        {
          aluno_id: alunoCriado.id,
          usuario_id: usuarioId,
        },
        { transaction },
      );

      await AlunoResponsavel.create(
        {
          aluno_id: alunoCriado.id,
          usuario_id: responsavelEncontrado.id,
        },
        { transaction },
      );

      const maiorOrdem = await buscarMaiorOrdem(rotaId, transaction);

      const rotaAluno = await RotaAluno.create(
        {
          aluno_id: alunoCriado.id,
          rota_id: rotaId,
          ordem: maiorOrdem + 1,
          status: 1,
        },
        {
          transaction,
        },
      );

      const previsaoFim = calcularPrevisaoFim(inicioContrato, tempoContrato);

      const dadosContrato = {
        usuario_id: usuarioId,
        responsavel_id: responsavelEncontrado.id,
        valor_mensalidade: valorMensalidade,
        inicio: inicioContrato,
        previsao_fim: previsaoFim,
        link: "teste",
        tempo_contrato: tempoContrato,
        dia_vencimento: diaVencimento,
      };

      const contratoCriado = await Contrato.create(dadosContrato, {
        transaction,
      });

      const usuario = await buscarUsuarioPorId(usuarioId);

      const dadosCriarContrato = {
        aluno: {
          id: alunoCriado.id,
          nome: alunoCriado.nome,
          escola: {
            nome: escolaNome,
          },
        },
        endereco: {
          rua: enderecoBuscado.rua,
          numero: enderecoBuscado.numero,
          bairro: enderecoBuscado.bairro,
          cidade: enderecoBuscado.cidade,
        },
        contratante: {
          nome: responsavelEncontrado.nome,
          cpf: responsavelEncontrado.cpf,
          telefone: responsavelEncontrado.telefone,
        },
        contratado: {
          id: usuario.id,
          nome: usuario.nome,
          cpf: usuario.cpf,
          telefone: usuario.telefone,
        },
        contrato: {
          inicio: contratoCriado.inicio,
          tempo_contrato: contratoCriado.tempo_contrato,
          previsao_fim: contratoCriado.previsao_fim,
          valor_mensalidade: contratoCriado.valor_mensalidade,
          dia_vencimento: contratoCriado.dia_vencimento,
        },
      };

      console.log("Responsavel encontrado", responsavelEncontrado);

      await criarPagamento(usuarioId, dadosContrato, transaction);

      const linkContrato = await criarContrato(dadosCriarContrato, transaction);

      contratoCriado.update({ link: linkContrato });

      await transaction.commit();

      return res.status(201).json({
        message: "Aluno cadastrado com sucesso",
        status: "success",
      });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return res
        .status(400)
        .json({ message: "Erro ao cadastrar aluno", status: "error" });
    }
  }

  static async buscarAlunos(req, res) {
    try {
      const usuarioId = req.usuario.id;

      const alunos = await AlunoUsuario.findAll({
        where: { usuario_id: usuarioId },
        include: [
          {
            model: Aluno,
            as: "aluno",
            where: { status: { [Op.ne]: 0 } },
            include: [
              {
                model: Escola,
                as: "escola",
              },
              {
                model: Endereco,
                as: "endereco",
                attributes: ["rua", "numero", "bairro", "cidade"],
              },
              {
                model: AlunoResponsavel,
                as: "responsavel",
                include: [
                  {
                    model: Usuario,
                    as: "responsavel",
                    attributes: ["nome", "cpf", "telefone", "email"],
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
                    attributes: ["nome", "id"],
                    include: [
                      {
                        model: Van,
                        as: "van",
                        attributes: ["id", "numero"],
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

      const alunosFlat = alunos.map((aluno) => {
        return {
          id: aluno.aluno.id,
          nome: aluno.aluno.nome,
          endereco: aluno.aluno.endereco,
          data_nascimento: aluno.aluno.data_nascimento,
          tipo_sanguineo: aluno.aluno.tipo_sanguineo,
          responsavel: aluno.aluno.responsavel.responsavel,
          rota: {
            id: aluno.aluno.rotasAluno[0]?.rota.id,
            nome: aluno.aluno.rotasAluno[0]?.rota.nome,
          },
          escola: {
            id: aluno.aluno.escola.id,
            nome: aluno.aluno.escola.nome,
            telefone: aluno.aluno.escola.telefone,
          },
          van: {
            id: aluno.aluno.rotasAluno[0]?.rota.van.id,
            modelo: aluno.aluno.rotasAluno[0]?.rota.van.modelo_van.modelo,
            numero: aluno.aluno.rotasAluno[0]?.rota.van.numero,
          },
          status: aluno.aluno.status,
        };
      });

      return res.status(200).json({ alunosFlat, alunos });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar alunos", status: "error" });
    }
  }

  static async visualizarAluno(req, res) {
    try {
      const id = req.params.id;
      const usuarioId = req.usuario.id;

      console.log(id);

      const aluno = await buscarAluno(id, usuarioId);

      if (!aluno) {
        console.log("Aluno não encontrado");
        return res
          .status(404)
          .json({ message: "Aluno não encontrado", status: "error" });
      }

      return res.status(200).json(aluno);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro ao buscar aluno",
        status: "error",
      });
    }
  }

  static async editarAluno(req, res) {
    const id = req.params.id;
    const usuarioId = req.usuario.id;

    const {
      nome,
      dataNascimento,
      rg,
      tipoSanguineo,
      cep,
      rua,
      numero,
      escolaId,
      bairro,
      cidade,
      estado,
      rotaId,
      responsavelId,
      nomeResponsavel,
      cpfResponsavel,
      telefoneResponsavel,
      emailResponsavel,
      status,
    } = req.body;

    const rotaEscolaRegistro = {
      rota_id: rotaId,
      escola_id: escolaId,
    };

    const rotaAlunoRegistro = {
      rota_id: rotaId,
      aluno_id: id,
    };

    const endereco = {
      cep: cep,
      rua: rua,
      numero: numero,
      bairro: bairro,
      cidade: cidade,
      estado: estado,
      longitude: null,
      latitude: null,
    };

    const responsavelRegistro = {
      nome: nomeResponsavel,
      cpf: cpfResponsavel,
      telefone: telefoneResponsavel,
      email: emailResponsavel,
    };

    const aluno = {
      nome: nome,
      data_nascimento: dataNascimento,
      rg: rg,
      tipo_sanguineo: tipoSanguineo,
      endereco_id: null,
      status: status,
      escola_id: escolaId,
    };

    try {
      const alunoEncontrado = await Aluno.findOne({
        where: { id: id },
      });

      if (!alunoEncontrado) {
        console.log("Aluno não encontrado!");

        return res
          .status(404)
          .json({ message: "Aluno não encontrado!", status: "error" });
      }

      const enderecoEncontrado = await Endereco.findOne({
        where: { cep: cep },
      });

      if (enderecoEncontrado) {
        if (alunoEncontrado.endereco_id != enderecoEncontrado.id) {
          aluno.endereco_id = enderecoEncontrado.id;
        } else {
          aluno.endereco_id = alunoEncontrado.endereco_id;
        }
      } else {
        const coordenadas = await buscarLatitude({
          rua,
          bairro,
          cidade,
          estado,
        });

        endereco.longitude = coordenadas.longitude;
        endereco.latitude = coordenadas.latitude;

        const enderecoCriado = await Endereco.create(endereco);

        aluno.endereco_id = enderecoCriado.id;
      }

      await alunoEncontrado.update(aluno);
      await RotaAluno.update(rotaAlunoRegistro, { where: { aluno_id: id } });
      await Usuario.update(responsavelRegistro, {
        where: { id: responsavelId },
      });

      return res
        .status(200)
        .json({ message: "Aluno atualizado com sucesso", status: "success" });
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ message: `Erro ao atualizar aluno`, status: "error" });
    }
  }

  static async excluirAluno(req, res) {
    try {
      const { id } = req.params;
      const usuarioId = req.usuario.id;
      const dataAtual = new Date();

      const alunoEncontrado = await AlunoUsuario.findOne({
        where: { usuario_id: usuarioId, aluno_id: id },
      });

      const aluno = await Aluno.findOne({
        where: { id: id },
      });

      const responsavelAluno = await AlunoResponsavel.findOne({
        where: { aluno_id: aluno.id },
      });

      const presencaEmViagem = await Presenca.findOne({
        where: { aluno_id: id },
      });

      const pagamentoProcessado = await Pagamento.findOne({
        where: { responsavel_id: responsavelAluno.usuario_id, status: 2 },
      });

      if (!presencaEmViagem && !pagamentoProcessado) {
        await alunoEncontrado.destroy();
        await aluno.destroy();
        await responsavelAluno.destroy();
        await Pagamento.destroy({
          where: { responsavel_id: responsavelAluno.usuario_id, status: 2 },
        });
        await Contrato.destroy({
          where: { responsavel_id: responsavelAluno.usuario_id },
        });
      }

      if (!alunoEncontrado) {
        return res
          .status(404)
          .json({ message: "Aluno não encontrado", status: "error" });
      }

      console.log("responsavel", responsavelAluno);
      if (!responsavelAluno) {
        return res
          .status(400)
          .json({ message: "Erro ao excluir aluno", status: "error" });
      }

      await Pagamento.update(
        { status: 0 },
        {
          where: {
            responsavel_id: responsavelAluno.usuario_id,
            data_vencimento: { [Op.gt]: dataAtual },
          },
        },
      );

      await aluno.update({ status: 0 });

      return res
        .status(200)
        .json({ message: "Aluno excluído com sucesso!", status: "success" });
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ message: "Erro ao excluir aluno!", status: "error" });
    }
  }
}
