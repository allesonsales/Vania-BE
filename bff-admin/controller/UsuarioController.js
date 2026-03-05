import { Op } from "sequelize";
import cookie from "cookie-parser";
import db from "../../conn/db.js";
import Usuario from "../../domain/models/Usuario.js";
import bcrypt from "bcrypt";
import verificarCampos from "../../domain/utils/verificarCampos.js";
import criarTokenUsuario from "../../domain/utils/token/criarTokenUsuario.js";
import AlunoResponsavel from "../../domain/models/relacoes/AlunoResponsavel.js";
import AlunoUsuario from "../../domain/models/relacoes/AlunoUsuario.js";
import Motorista from "../../domain/models/Motorista.js";
import VanUsuario from "../../domain/models/relacoes/VanUsuario.js";
import Van from "../../domain/models/Van.js";
import Aluno from "../../domain/models/Aluno.js";
import Presenca from "../../domain/models/Presenca.js";
import Rota from "../../domain/models/Rota.js";
import Viagem from "../../domain/models/Viagem.js";
import RotaAluno from "../../domain/models/relacoes/RotaAluno.js";
import Escola from "../../domain/models/Escola.js";
import Pagamento from "../../domain/models/Pagamento.js";

export class UsuarioController {
  static async cadastrarUsuario(req, res) {
    try {
      const {
        nome,
        nomeFantasia,
        dataNascimento,
        cpf,
        telefone,
        email,
        senha,
        confirmacaoSenha,
      } = req.body;

      const camposObrigatorios = {
        nome,
        dataNascimento,
        cpf,
        telefone,
        email,
        senha,
        confirmacaoSenha,
      };

      try {
        verificarCampos(camposObrigatorios);
      } catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: error });
      }

      const verificarUsuario = await Usuario.findOne({
        where: { [Op.or]: [{ email: email }, { cpf: cpf }] },
      });

      if (verificarUsuario) {
        console.log("Usuário já cadastrado!");
        return res
          .status(409)
          .json({ message: "Usuário já cadastrado em nosso sistema!" });
      }

      if (senha != confirmacaoSenha) {
        console.log("Senhas diferentes!");
        return res
          .status(409)
          .json({ message: "As senhas cadastradas estão diferentes!" });
      }

      const salt = bcrypt.genSaltSync(12);

      const senhaHash = bcrypt.hashSync(senha, salt);

      const usuario = {
        nome: nome,
        nome_fantasia: nomeFantasia,
        data_nascimento: dataNascimento,
        cpf: cpf,
        telefone: telefone,
        email: email,
        senha: senhaHash,
        tipo: 1,
        status: 1,
      };

      let usuarioCadastrado = await Usuario.create(usuario);

      const token = criarTokenUsuario(usuarioCadastrado);

      return res.status(201).json({ usuario: usuarioCadastrado, token });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao cadastrar usuário!", status: "error" });
    }
  }

  static async cadastrarSenhaPrimeiroAcesso(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(409)
        .json({ message: "Digite e-mail e senha!", status: "error" });
    }

    try {
      const usuario = await Usuario.findOne({
        where: { email: email },
      });

      const salt = bcrypt.genSaltSync(12);

      const senhaHash = bcrypt.hashSync(senha, salt);

      await usuario.update({ senha: senhaHash, status: 1 });

      const token = criarTokenUsuario(usuario);

      return res
        .status(200)
        .json({ message: "Senha cadastrada!", status: "success", token });
    } catch (error) {}
  }

  static async verificarEmail(req, res) {
    const { email } = req.body;

    if (!email) {
      return res
        .status(409)
        .json({ message: "Digite o e-mail!", status: "error" });
    }

    try {
      const usuarioEncontrado = await Usuario.findOne({
        where: { email: email },
      });

      if (!usuarioEncontrado) {
        return res
          .status(404)
          .json({ message: "Usuário não encontrado!", status: "error" });
      }

      if (usuarioEncontrado.senha) {
        return res.status(200).json({
          message: "Senha já cadastrada!",
          status: "error",
          senhaCadastrada: true,
        });
      }

      return res.status(200).json({
        message: "Digite uma senha!",
        status: "success",
        senhaCadastrada: false,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao verificar usuário!", status: "error" });
    }
  }

  static async editarUsuario(req, res) {
    const usuarioId = req.usuario.id;
    const { nome, nomeFantasia, dataNascimento, email, cpf, telefone } =
      req.body;

    try {
      if (!nome || !nomeFantasia || !email || !cpf || !telefone) {
        return res
          .status(400)
          .json({ message: "Preencha todos os campos!", status: "error" });
      }

      const usuarioEncontrado = await Usuario.findOne({
        where: { id: usuarioId },
      });

      if (!usuarioEncontrado) {
        return res
          .status(409)
          .json({ message: "Usuário não encontrado", status: "error" });
      }

      const payload = {
        nome: nome,
        telefone: telefone,
        data_nascimento: dataNascimento,
        email: email,
        nome_fantasia: nomeFantasia,
      };

      await usuarioEncontrado.update(payload);

      return res
        .status(200)
        .json({ message: "Perfil atualizado com sucesso!", status: "success" });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Erro ao atualizar usuário!", status: "error" });
    }
  }

  static async buscarUsuario(req, res) {}

  static async login(req, res) {
    const isProd = process.env.NODE_ENV === "production";

    try {
      const { email, senha } = req.body;

      let camposObrigatorios = { email, senha };

      try {
        await verificarCampos(camposObrigatorios);
      } catch (error) {
        return res.status(409).json({ message: `${error.message}` });
      }

      const usuario = await Usuario.findOne({ where: { email: email } });

      if (!usuario.senha) {
        return res.status(401).json({
          message:
            "É seu primeiro acesso? Clique em primeiro acesso e cadastre uma senha!",
          status: "error",
        });
      }

      if (!usuario) {
        return res
          .status(401)
          .json({ message: "E-mail ou senha inválidos", status: "error" });
      }

      if (usuario.status == 0) {
        return res
          .status(401)
          .json({ message: "Usuário não encontrado!", status: "error" });
      }

      const verificarSenha = bcrypt.compareSync(senha, usuario.senha);

      if (!verificarSenha) {
        return res
          .status(401)
          .json({ message: "E-mail ou senha inválidos!", status: "error" });
      }

      const token = criarTokenUsuario(usuario);

      res.cookie("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: "Login realizado com sucesso!",
        status: "success",
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao tentar fazer login!" });
    }
  }

  static async logout(req, res) {
    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    return res
      .status(200)
      .json({ message: "Logout realizado com sucesso!", status: "error" });
  }

  static async alterarSenha(req, res) {}

  static async recuperarSenha(req, res) {
    const { email, senha, confirmarSenha } = req.body;

    try {
      if (!senha || !confirmarSenha) {
        return res.status(400).json({
          message: "Digite a senha e confirme a senha!",
          status: "error",
        });
      }

      if (senha != confirmarSenha) {
        return res
          .status(400)
          .json({ message: "As senhas não coincidem!", status: "errror" });
      }

      const usuarioEncontrado = await Usuario.findOne({
        where: { email: email },
      });

      const salt = await bcrypt.genSalt(12);

      const senhaHash = await bcrypt.hash(senha, salt);

      await usuarioEncontrado.update({ senha: senhaHash });

      return res
        .status(200)
        .json({ message: "Senha atualizada com sucesso!", status: "success" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao atualizar senha!", status: "error" });
    }
  }

  static async excluirUsuario(req, res) {
    const usuarioId = req.usuario.id;
    const transaction = await db.transaction();
    try {
      await AlunoResponsavel.destroy({
        where: { usuario_id: usuarioId },
        transaction,
      });

      await AlunoUsuario.destroy({
        where: { usuario_id: usuarioId },
        transaction,
      });

      const alunoVinculos = await AlunoUsuario.findAll({
        where: { usuario_id: usuarioId },
        transaction,
      });

      const alunoIds = alunoVinculos.map((aluno) => aluno.aluno_id);

      if (alunoIds.length > 0) {
        await Aluno.destroy({
          where: { id: alunoIds },
          transaction,
        });

        await Presenca.destroy({
          where: { aluno_id: alunoIds },
          transaction,
        });
      }

      const rotaVinculo = await Rota.findAll({
        where: { usuario_id: usuarioId },
      });

      const rotasId = rotaVinculo.map((rota) => rota.usuario_id);

      if (rotasId.length > 0) {
        await Viagem.destroy({
          where: { rota_id: rotasId },
          transaction,
        });

        await RotaAluno.destroy({
          where: { rota_id: rotasId },
          transaction,
        });
      }

      await Rota.destroy({
        where: { usuario_id: usuarioId },
        transaction,
      });

      const vans = await VanUsuario.findAll({
        where: { usuario_id: usuarioId },
        include: { model: Van, as: "van" },
        transaction,
      });

      const vanIds = vans.map((v) => v.van_id);

      await VanUsuario.destroy({
        where: { usuario_id: usuarioId },
        transaction,
      });

      if (vanIds.length > 0) {
        await Van.destroy({
          where: { id: vanIds },
          transaction,
        });
      }

      const motoristasVinculo = await Motorista.findAll({
        where: { usuario_id: usuarioId },
        transaction,
      });

      const motoristasId = motoristasVinculo.map(
        (motorista) => motorista.usuario_motorista_id,
      );

      await Motorista.destroy({
        where: {
          usuario_motorista_id: usuarioId,
        },
        transaction,
      });

      await Motorista.destroy({
        where: { usuario_id: usuarioId },
        transaction,
      });

      if (motoristasId.length > 0) {
        await Usuario.destroy({
          where: { id: motoristasId },
          transaction,
        });
      }

      await Usuario.destroy({
        where: { id: usuarioId },
        transaction,
      });

      await transaction.commit();

      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      return res.status(204);
    } catch (error) {
      await transaction.rollback();
      console.error(error);

      return res.status(500).json({ message: "Erro ao excluir usuário!" });
    }
  }

  static async pegarUsuario(req, res) {
    const usuarioId = req.usuario.id;

    try {
      const usuarioTabela = await Usuario.findOne({
        where: { id: usuarioId },
        include: [{ model: Escola }, { model: Rota }],
      });

      const totalEscolas = await Escola.count({
        where: { usuario_id: usuarioId },
      });

      const totalRotas = await Rota.count({ where: { usuario_id: usuarioId } });

      const totalMotorista = await Motorista.count({
        where: { usuario_id: usuarioId },
      });
      const totalAlunos = await AlunoUsuario.count({
        where: { usuario_id: usuarioId },
      });

      const totalVans = await VanUsuario.count({
        where: { usuario_id: usuarioId },
      });

      const totalViagens = await Viagem.count({
        where: { usuario_id: usuarioId },
      });

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const totalVencidos = await Pagamento.count({
        distinct: "true",
        col: "responsavel_id",
        where: {
          usuario_id: usuarioId,
          pago_em: null,
          data_vencimento: { [Op.lt]: hoje },
        },
      });

      const usuarioFlat = {
        nome: usuarioTabela.nome,
        cpf: usuarioTabela.cpf,
        tipo: usuarioTabela.tipo,
        data_nascimento: usuarioTabela.data_nascimento,
        email: usuarioTabela.email,
        nome_fantasia: usuarioTabela.nome_fantasia,
        telefone: usuarioTabela.telefone,
        total_rotas: totalRotas,
        total_escolas: totalEscolas,
        total_alunos: totalAlunos,
        total_vencidos: totalVencidos,
        total_vans: totalVans,
        total_viagens: totalViagens,
        total_motorista: totalMotorista,
      };

      if (!usuarioTabela) {
        return res
          .status(401)
          .json({ message: "Nenhum usuário encontrado!", status: "error" });
      }

      return res.status(200).json(usuarioFlat);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao consultar usuário!", status: "error" });
    }
  }
}
