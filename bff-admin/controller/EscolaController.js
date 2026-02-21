import { Model, Op } from "sequelize";
import Escola from "../../domain/models/Escola.js";
import buscarEscola from "../../domain/utils/escolas/buscarEscola.js";
import verificarEndereco from "../../domain/utils/enderecos/verificarEndereco.js";
import verificarCampos from "../../domain/utils/verificarCampos.js";
import EscolaEnum from "../../domain/models/enums/Escola_enum.js";
import Endereco from "../../domain/models/Endereco.js";
import consultarNumerosDeAlunosPorEscola from "../../domain/utils/escolas/consultarNumeroDeAlunos.js";
import Rota from "../../domain/models/Rota.js";
import sequelize from "../../conn/db.js";
import consultarNumeroDeRotasAtivasPorEscola from "../../domain/utils/escolas/consultarNumeroRotasAtivas.js";
import RotaEscola from "../../domain/models/relacoes/RotaEscola.js";

export class EscolaController {
  static async listarEscolas(req, res) {
    try {
      const usuarioId = req.usuario.id;

      const escolas = await Escola.findAll({
        include: { model: Endereco, as: "endereco" },
        where: { [Op.and]: { usuario_id: usuarioId, status: { [Op.ne]: 0 } } },
      });

      return res.status(200).json(escolas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao exibir escolas!" });
    }
  }

  static async detalheEscola(req, res) {
    try {
      const id = req.params.id;
      console.log(`Detalhando escola de id: ${id}`);
      const escola = await buscarEscola(id);
      const totalAlunosPorEscola = await consultarNumerosDeAlunosPorEscola(id);
      const totalRotasAtivas = await consultarNumeroDeRotasAtivasPorEscola(id);

      return res
        .status(200)
        .json({ escola, totalAlunosPorEscola, totalRotasAtivas });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar escola!" });
    }
  }

  static async cadastrarEscola(req, res) {
    const usuarioId = req.usuario.id;
    try {
      const { nome, telefone, cep, rua, numero, bairro, cidade, estado, tipo } =
        req.body;

      const camposObrigatorios = {
        nome,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        tipo,
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

      const escola = {
        nome: nome,
        telefone: telefone,
        tipo: tipo,
        endereco_id: null,
        status: 1,
        usuario_id: usuarioId,
      };

      try {
        verificarCampos(camposObrigatorios);
      } catch (error) {
        return res
          .status(400)
          .json({ message: error.message, status: "error" });
      }

      const enderecoBuscado = await verificarEndereco(endereco);

      const escolaCadastrada = await Escola.findOne({
        where: { nome: nome, endereco_id: enderecoBuscado.id },
      });

      if (escolaCadastrada) {
        console.log("Escola já cadastrada!");
        return res
          .status(409)
          .json({ message: "Escola já cadastrada!", status: "error" });
      }

      escola.endereco_id = enderecoBuscado.id;

      await Escola.create(escola);
      return res
        .status(201)
        .json({ message: "Escola cadastrada com sucesso!", status: "success" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao criar escola", status: "error" });
    }
  }

  static async editarEscola(req, res) {
    try {
      const { id } = req.params;
      console.log(`Atualizando escola de id: ${id}`);

      const {
        nome,
        telefone,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        tipo,
        status,
      } = req.body;

      const camposObrigatorios = {
        nome,
        telefone,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        tipo,
      };

      const endereco = {
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado,
      };

      const escola = {
        nome: nome,
        telefone: telefone,
        tipo: tipo,
        endereco_id: null,
        status: status,
      };

      try {
        verificarCampos(camposObrigatorios);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }

      const escolaEncontrada = await Escola.findOne({ where: { id: id } });

      if (!escolaEncontrada) {
        console.log("Escola não encontrada...");
        return res.status(404).json({ message: "Escola não encontrada!" });
      }

      const enderecoBuscado = await verificarEndereco(endereco);

      escola.endereco_id = enderecoBuscado.id;

      await escolaEncontrada.update(escola);

      console.log("Escola atualizada com sucesso!");
      return res
        .status(200)
        .json({ message: "Escola atualizada com sucesso!" });
    } catch (error) {
      console.error(error);
    }
  }

  static async buscarTipos(req, res) {
    try {
      const tipos = await EscolaEnum.findAll();
      return res.status(200).json(tipos);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar tipos de escola!", status: "error" });
    }
  }

  static async deletarEscola(req, res) {
    try {
      const escolaId = req.params.id;

      const escola = await Escola.findOne({
        where: { id: escolaId },
      });

      if (!escola) {
        return res
          .status(404)
          .json({ message: "Escola não encontrada!", status: "error" });
      }

      const rotasDaEscolaAtiva = await RotaEscola.findOne({
        where: { escola_id: escolaId },
        include: [{ model: Rota, as: "rota", where: { status: 1 } }],
      });

      if (rotasDaEscolaAtiva) {
        return res.status(200).json({
          message:
            "Não foi possível excluir a escola. Existem rotas ativas associadas a ela.",
          status: "error",
        });
      }

      await await escola.destroy();

      return res
        .status(200)
        .json({ message: "Escola excluída com sucesso!", status: "success" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao excluir escola!", status: "error" });
    }
  }
}
