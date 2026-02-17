import Usuario from "../../domain/models/Usuario";
import bcrypt from "bcrypt";
import criarTokenUsuario from "../../domain/utils/token/criarTokenUsuario";
import cookie from "cookie-parser";

export class UsuarioController {
  static async login(req, res) {
    const { email, senha } = req.body;

    try {
      const usuario = await Usuario.findOne({ where: { email: email } });

      if (!usuario) {
        return res
          .status(401)
          .json({ message: "E-mail ou senha inválidos!", status: "error" });
      }

      if (usuario.tipo != 2) {
        return res.status(401).json({
          message: "Este sistema é exclusivo para o uso de motoristas!",
          status: "error",
        });
      }

      if (usuario.status == 2) {
        return res.status(200).json({
          message: "Cadastre uma senha para acessar o aplicativo!",
          status: "atention",
          primeiroAcesso: true,
        });
      }

      const senhaMatch = bcrypt.compareSync(senha, usuario.senha);

      if (!senhaMatch) {
        return res
          .status(401)
          .json({ message: "E-mail ou senha inválidos!", status: "error" });
      }

      const token = criarTokenUsuario(usuario);

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
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
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
    return res
      .status(200)
      .json({ message: "Logout realizado com sucesso!", status: "error" });
  }
}
