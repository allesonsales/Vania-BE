import Aluno from "./Aluno.js";
import Endereco from "./Endereco.js";
import EscolaEnum from "./enums/Escola_enum.js";
import Escola from "./Escola.js";
import MarcaVan from "./Marca.js";
import ModeloVan from "./Modelo.js";
import Motorista from "./Motorista.js";
import Presenca from "./Presenca.js";
import AlunoUsuario from "./relacoes/AlunoUsuario.js";
import Rota from "./Rota.js";
import Usuario from "./Usuario.js";
import UsuarioEnum from "./enums/Usuario_Enum.js";
import Van from "./Van.js";
import Viagem from "./Viagem.js";
import VanUsuario from "./relacoes/VanUsuario.js";
import UsuarioStatusEnum from "./enums/Usuario_status_enum.js";
import Pagamento from "./Pagamento.js";
import PagamentoStatusEnum from "./enums/Pagamento_status_enum.js";
import PagamentoTipoEnum from "./enums/Pagamento_tipo_enum.js";
import AlunoResponsavel from "./relacoes/AlunoResponsavel.js";
import Contrato from "./Contrato.js";
import RotaAluno from "./relacoes/RotaAluno.js";
import RotaEscola from "./relacoes/RotaEscola.js";

AlunoUsuario.belongsTo(Aluno, {
  foreignKey: "aluno_id",
  as: "aluno",
});

AlunoUsuario.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});

AlunoResponsavel.belongsTo(Aluno, { foreignKey: "aluno_id", as: "aluno" });
AlunoResponsavel.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "responsavel",
});

Usuario.hasMany(AlunoResponsavel, {
  foreignKey: "usuario_id",
  as: "Alunoresponsavel",
  onDelete: "CASCADE",
});

VanUsuario.belongsTo(Van, {
  foreignKey: "van_id",
  as: "van",
  onDelete: "CASCADE",
});
VanUsuario.belongsTo(Usuario, { foreignKey: "usuario_id" });

Aluno.hasOne(AlunoResponsavel, { foreignKey: "aluno_id", as: "responsavel" });
Aluno.hasMany(AlunoUsuario, {
  foreignKey: "aluno_id",
  as: "usuarios",
  onDelete: "CASCADE",
});
Usuario.hasMany(AlunoUsuario, { foreignKey: "usuario_id" });

Van.hasMany(VanUsuario, { foreignKey: "van_id" });
Usuario.hasMany(VanUsuario, { foreignKey: "usuario_id", onDelete: "CASCADE" });

Usuario.belongsTo(UsuarioEnum, {
  foreignKey: "tipo",
  as: "perfil",
});
UsuarioEnum.hasMany(Usuario, {
  foreignKey: "tipo",
});

Aluno.belongsTo(Escola, {
  foreignKey: "escola_id",
  as: "escola",
});

Escola.hasMany(Aluno, {
  foreignKey: "escola_id",
});

Aluno.belongsTo(Endereco, {
  foreignKey: "endereco_id",
  as: "endereco",
});
Endereco.hasMany(Aluno, {
  foreignKey: "endereco_id",
});

Escola.belongsTo(Endereco, {
  foreignKey: "endereco_id",
  as: "endereco",
});
Endereco.hasMany(Escola, {
  foreignKey: "endereco_id",
});

Motorista.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});
Usuario.hasOne(Motorista, {
  foreignKey: "usuario_id",
  onDelete: "CASCADE",
});

Motorista.belongsTo(Usuario, {
  foreignKey: "usuario_motorista_id",
  as: "motoristaUsuario",
});
Usuario.hasOne(Motorista, {
  foreignKey: "usuario_motorista_id",
});

Rota.belongsToMany(Escola, {
  through: RotaEscola,
  foreignKey: "rota_id",
  otherKey: "escola_id",
  as: "escolas",
});

Escola.belongsToMany(Rota, {
  through: RotaEscola,
  foreignKey: "escola_id",
  otherKey: "rota_id",
  as: "rotas",
});

RotaEscola.belongsTo(Rota, {
  foreignKey: "rota_id",
  as: "rota",
});

Rota.belongsTo(Endereco, {
  foreignKey: "partida_id",
});

Endereco.hasMany(Rota, {
  foreignKey: "partida_id",
});

Escola.belongsTo(EscolaEnum, {
  foreignKey: "tipo",
  as: "tipoEscola",
});
EscolaEnum.hasMany(Escola, {
  foreignKey: "tipo",
});

Rota.belongsTo(Motorista, {
  foreignKey: "motorista_id",
  as: "motorista",
});
Motorista.hasMany(Rota, {
  foreignKey: "motorista_id",
  onDelete: "CASCADE",
});

Rota.belongsTo(Usuario, {
  foreignKey: "usuario_id",
});

Usuario.hasMany(Rota, {
  foreignKey: "usuario_id",
  onDelete: "CASCADE",
});

Contrato.belongsTo(Usuario, {
  foreignKey: "usuario_id",
});

Usuario.hasOne(Contrato, {
  foreignKey: "usuario_id",
  onDelete: "CASCADE",
});

Contrato.belongsTo(Usuario, {
  foreignKey: "responsavel_id",
});

RotaAluno.belongsTo(Rota, {
  foreignKey: "rota_id",
  as: "rota",
  onDelete: "CASCADE",
});
Rota.hasMany(RotaAluno, { foreignKey: "rota_id", onDelete: "CASCADE" });

RotaAluno.belongsTo(Aluno, { foreignKey: "aluno_id", as: "aluno" });
Aluno.hasMany(RotaAluno, {
  foreignKey: "aluno_id",
  as: "rotasAluno",
  onDelete: "CASCADE",
});

Usuario.hasOne(Contrato, {
  foreignKey: "responsavel_id",
  onDelete: "CASCADE",
});

Rota.belongsTo(Van, {
  foreignKey: "van_id",
  as: "van",
});
Van.hasMany(Rota, {
  foreignKey: "van_id",
  onDelete: "CASCADE",
});

Escola.belongsTo(Usuario, {
  foreignKey: "usuario_id",
});
Usuario.hasMany(Escola, {
  foreignKey: "usuario_id",
});

ModeloVan.belongsTo(MarcaVan, {
  foreignKey: "marca_id",
  as: "marca",
});
MarcaVan.hasMany(ModeloVan, {
  foreignKey: "marca_id",
});

Presenca.belongsTo(Aluno, {
  foreignKey: "aluno_id",
  as: "aluno",
});

Aluno.hasMany(Presenca, {
  foreignKey: "aluno_id",
  onDelete: "Cascade",
});

Presenca.belongsTo(Viagem, {
  foreignKey: "viagem_id",
  as: "viagem",
});
Viagem.hasMany(Presenca, {
  foreignKey: "viagem_id",
  as: "presenca",
});

Usuario.belongsTo(UsuarioStatusEnum, {
  foreignKey: "status",
});
UsuarioStatusEnum.hasMany(Usuario, {
  foreignKey: "status",
});

Van.belongsTo(MarcaVan, {
  foreignKey: "marca_id",
});

MarcaVan.hasMany(Van, {
  foreignKey: "marca_id",
});

ModeloVan.belongsTo(MarcaVan, {
  foreignKey: "marca_id",
});

MarcaVan.hasMany(ModeloVan, {
  foreignKey: "marca_id",
});

Van.belongsTo(ModeloVan, {
  foreignKey: "modelo",
});

ModeloVan.hasMany(Van, {
  foreignKey: "modelo",
});

Viagem.belongsTo(Usuario, {
  foreignKey: "usuario_id",
});

Usuario.hasMany(Viagem, {
  foreignKey: "usuario_id",
  onDelete: "CASCADE",
});

Pagamento.belongsTo(PagamentoStatusEnum, {
  foreignKey: "status",
});

PagamentoStatusEnum.hasMany(Pagamento, {
  foreignKey: "status",
});

Pagamento.belongsTo(PagamentoTipoEnum, {
  foreignKey: "tipo",
});

PagamentoTipoEnum.hasMany(Pagamento, {
  foreignKey: "tipo",
});

Viagem.belongsTo(Rota, {
  foreignKey: "rota_id",
  as: "rota",
});

Rota.hasMany(Viagem, {
  foreignKey: "rota_id",
  as: "viagens",
  onDelete: "CASCADE",
});

Pagamento.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});

Pagamento.belongsTo(Usuario, {
  foreignKey: "responsavel_id",
  as: "responsavel",
});

Usuario.hasMany(Pagamento, {
  foreignKey: "usuario_id",
  as: "pagamentosCriados",
  onDelete: "CASCADE",
});

Usuario.hasMany(Pagamento, {
  foreignKey: "responsavel_id",
  as: "pagamentosResponsavel",
});
