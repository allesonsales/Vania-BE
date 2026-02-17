import Motorista from "../../domain/models/Motorista.js";
import consultarNumerosMotorista from "../../domain/utils/motoristas/consultarNumerosMotorista.js";

export class MotoristaController {
  static async consultarMotorista(req, res) {
    console.log("Chamou controller consultar numero motorista");
    const usuarioId = req.usuario.id;
    const motoristaBD = await Motorista.findOne({
      where: { usuario_motorista_id: usuarioId },
    });
    console.log(motoristaBD);

    const motorista = await consultarNumerosMotorista(motoristaBD.id);

    console.log(motorista);

    return res.status(200).json(motorista);
  }
}
