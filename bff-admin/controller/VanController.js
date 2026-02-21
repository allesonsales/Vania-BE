import MarcaVan from "../../domain/models/Marca.js";
import ModeloVan from "../../domain/models/Modelo.js";
import VanUsuario from "../../domain/models/relacoes/VanUsuario.js";
import Rota from "../../domain/models/Rota.js";
import Van from "../../domain/models/Van.js";
import contarTotalAlunos from "../../domain/utils/alunos/contarTotalAlunos.js";
import consultarVan from "../../domain/utils/vans/consultarVan.js";
import consultarVans from "../../domain/utils/vans/consultarVans.js";
import contarTotalRotas from "../../domain/utils/vans/contarTotalRotas.js";
import verificarCampos from "../../domain/utils/verificarCampos.js";

export class VanController {
  static async cadastrarVan(req, res) {
    try {
      const usuarioId = req.usuario.id;

      const { numero, renavam, placa, lugares, marcaId, modelo, ano } =
        req.body;

      const camposObrigatorios = { numero, placa, marcaId, modelo };

      const van = {
        numero: numero,
        renavam: renavam,
        placa: placa,
        marca_id: marcaId,
        lugares: lugares,
        modelo: modelo,
        status: 1,
        ano: ano,
      };

      try {
        verificarCampos(camposObrigatorios);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }

      const placaEncontrada = await Van.findOne({
        where: { placa: placa },
      });

      if (placaEncontrada) {
        return res.status(409).json({
          message: "Placa já cadastrada em nosso sistema!",
          status: "error",
        });
      }

      const vanEncontrada = await VanUsuario.findOne({
        where: { usuario_id: usuarioId },
        include: {
          model: Van,
          as: "van",
          where: { numero: numero },
        },
      });

      if (vanEncontrada) {
        return res
          .status(409)
          .json({ message: "Número de van já cadastrado!", status: "error" });
      }

      const vanCriada = await Van.create(van);

      const registroVanUsuario = {
        van_id: vanCriada.id,
        usuario_id: Number(usuarioId),
      };

      await VanUsuario.create(registroVanUsuario);

      return res
        .status(201)
        .json({ message: "Van cadastrada com sucesso!", status: "success" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao cadastrar van!", status: "error" });
    }
  }

  static async buscarVans(req, res) {
    try {
      const usuarioId = req.usuario.id;

      if (!usuarioId) return;

      const vansEncontradas = await consultarVans(usuarioId);
      if (!vansEncontradas) {
        console.log("Nenhuma van cadastada...");
        return res
          .status(200)
          .json({ message: "Nenhuma van cadastrada!", status: "error" });
      }
      return res.status(200).json(vansEncontradas);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar vans", status: "error" });
    }
  }

  static async buscarVan(req, res) {
    try {
      const vanId = req.params.vanId;

      const vanEncontrada = await consultarVan(vanId);

      if (!vanEncontrada) {
        return res
          .status(200)
          .json({ message: "Van não encontrada!", status: "error" });
      }

      const totalAlunos = await contarTotalAlunos(vanId);
      const totalRotasAtendidas = await contarTotalRotas(vanId);

      return res
        .status(200)
        .json({ vanEncontrada, totalAlunos, totalRotasAtendidas });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar van!", status: "error" });
    }
  }

  static async editarVan(req, res) {
    const vanId = req.params.vanId;
    const usuarioId = req.usuario.id;
    const { numero, lugares, placa, renavam, modelo, marcaId } = req.body;

    const dadosVan = {
      numero: numero,
      lugares: lugares,
      placa: placa,
      renavam: renavam,
      modelo: modelo,
      marca_id: marcaId,
    };

    try {
      const vanEncontrada = await consultarVan(vanId, usuarioId);

      if (!vanEncontrada) {
        console.log("Van não encontrada!");

        return res
          .status(400)
          .json({ message: "Van não encontrada!", status: "error" });
      }

      await vanEncontrada.update(dadosVan);
      return res.status(200).json({
        message: "Van atualizada com sucesso!",
        status: "success",
        van: vanEncontrada,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error });
    }
  }

  static async excluirVan(req, res) {
    const { vanId } = req.params;

    const usuarioId = req.usuario.id;

    try {
      const vanEncontrada = await consultarVan(vanId, usuarioId);

      if (!vanEncontrada) {
        console.log("Van não encontrada!");

        return res
          .status(400)
          .json({ message: "Van não encontrada!", status: "error" });
      }

      const vanEmRotaAtiva = await Rota.findOne({
        where: {
          van_id: vanId,
          status: 1,
        },
      });

      const vanEmRotaInativa = await Rota.findOne({
        where: { van_id: vanId, status: 0 },
      });

      if (vanEmRotaAtiva) {
        return res.status(400).json({
          message:
            "Não foi possível excluir a van. Existem rotas ativas associadas a ela.",
          status: "error",
        });
      }

      if (vanEmRotaInativa) {
        vanEncontrada.update({ status: 0 });
        return res
          .status(200)
          .json({ message: "Van desativada com sucesso!", status: "success" });
      }

      await VanUsuario.destroy({
        where: { van_id: vanId },
      });

      await vanEncontrada.destroy();

      return res
        .status(201)
        .json({ message: "Van excluída com sucesso!", status: "success" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao excluir van!", status: "error" });
    }
  }

  static async buscarMarcas(req, res) {
    try {
      const marcas = await MarcaVan.findAll();

      return res.status(200).json(marcas);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar marcas!", status: "error" });
    }
  }

  static async buscarModelos(req, res) {
    try {
      const marcaId = req.params.marcaId;
      const modelos = await ModeloVan.findAll({
        where: { marca_id: marcaId },
      });

      return res.status(200).json(modelos);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar modelos!", status: "error" });
    }
  }
}
