import fs, { existsSync } from "fs";
import path from "path";
import PDFDocument from "pdfkit";

async function criarContrato(dados, transaction) {
  const pathContrato = path.resolve("contratos");
  console.log("dados que chegaram:", dados);

  const data = new Date();
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  const dataAtual = `${dia}-${mes}-${ano}`;
  const diaFim = String(dados.contrato.previsao_fim.getDate()).padStart(2, "0");
  const mesFim = String(dados.contrato.previsao_fim.getDate()).padStart(2, "0");
  const anoFim = String(dados.contrato.previsao_fim.getFullYear() + 1).padStart(
    2,
    "0",
  );
  const dataFim = `${diaFim}/${mesFim}/${anoFim}`;

  if (!existsSync(pathContrato)) {
    fs.mkdirSync(pathContrato);
  }

  const caminhoArquivo = path.join(
    pathContrato,
    `${dados.aluno.id}-${dados.aluno.nome.replace(/\s+/g, "_")}.pdf`,
  );

  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });

  doc.pipe(fs.createWriteStream(caminhoArquivo));

  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("CONTRATO DE PRESTAÇÃO DE SERVIÇO DE TRANSPORTE ESCOLAR", {
      align: "center",
    });

  doc.moveDown(2);

  doc.font("Helvetica-Bold").fontSize(13).text("CONTRATANTE");
  doc.moveDown(0.5);

  doc.font("Helvetica-Bold").text("Nome: ", { continued: true });
  doc.font("Helvetica").text(dados.contratante.nome);

  doc.font("Helvetica-Bold").text("CPF: ", { continued: true });
  doc.font("Helvetica").text(dados.contratante.cpf);

  doc.font("Helvetica-Bold").text("Telefone: ", { continued: true });
  doc.font("Helvetica").text(dados.contratante.telefone);

  doc.moveDown();

  doc.font("Helvetica-Bold").fontSize(13).text("CONTRATADO(A)");
  doc.moveDown(0.5);

  doc.font("Helvetica-Bold").text("Nome: ", { continued: true });
  doc.font("Helvetica").text(dados.contratado.nome);

  doc.font("Helvetica-Bold").text("CPF/CNPJ: ", { continued: true });
  doc.font("Helvetica").text(dados.contratado.cpf);

  doc.font("Helvetica-Bold").text("Telefone: ", { continued: true });
  doc.font("Helvetica").text(dados.contratado.telefone);

  doc.moveDown();

  doc.font("Helvetica-Bold").fontSize(13).text("ALUNO(A)");
  doc.moveDown(0.5);

  doc.font("Helvetica-Bold").text("Nome: ", { continued: true });
  doc.font("Helvetica").text(dados.aluno.nome);

  doc.font("Helvetica-Bold").text("Escola: ", { continued: true });
  doc.font("Helvetica").text(dados.aluno.escola.nome);

  doc.font("Helvetica-Bold").text("Endereço: ", { continued: true });
  doc
    .font("Helvetica")
    .text(
      `${dados.endereco.rua}, ${dados.endereco.numero} - ${dados.endereco.bairro} - ${dados.endereco.cidade}`,
    );

  doc.font("Helvetica-Bold").text("Modalidade: ", { continued: true });
  doc.font("Helvetica").text("Ida e Volta");

  doc.moveDown();

  doc.font("Helvetica-Bold").fontSize(13).text("PERÍODO DO CONTRATO");
  doc.moveDown(0.5);

  doc.font("Helvetica-Bold").text("Início: ", { continued: true });
  doc.font("Helvetica").text(dados.contrato.inicio);

  doc.font("Helvetica-Bold").text("Fim: ", { continued: true });
  doc.font("Helvetica").text(dados.contrato.previsao_fim);

  doc.moveDown();

  doc.font("Helvetica-Bold").fontSize(13).text("CONDIÇÕES DE VALOR");
  doc.moveDown(0.5);

  doc.font("Helvetica-Bold").text("Valor total: ", { continued: true });
  doc
    .font("Helvetica")
    .text(
      `R$ ${dados.contrato.valor_mensalidade * dados.contrato.tempo_contrato}`,
    );

  doc.font("Helvetica-Bold").text("Parcelas: ", { continued: true });
  doc.font("Helvetica").text(dados.contrato.tempo_contrato);

  doc.font("Helvetica-Bold").text("Valor da parcela: ", { continued: true });
  doc.font("Helvetica").text(`R$ ${dados.contrato.valor_mensalidade}`);

  doc.font("Helvetica-Bold").text("Vencimento: ", { continued: true });
  doc.font("Helvetica").text(`Dia ${dados.contrato.dia_vencimento}`);

  doc.font("Helvetica-Bold").text("Multa por atraso: ", { continued: true });
  doc.font("Helvetica").text("2%");

  doc.moveDown();

  doc.font("Helvetica-Bold").fontSize(13).text("DO OBJETO");
  doc.moveDown(0.5);

  doc
    .font("Helvetica")
    .text(
      "Cláusula 1ª — O serviço contratado consiste no transporte do aluno acima citado, no trajeto acordado entre as partes.",
      { align: "justify" },
    );

  doc.moveDown();

  doc.font("Helvetica-Bold").fontSize(13).text("DA PRESTAÇÃO DO SERVIÇO");
  doc.moveDown(0.5);

  doc
    .font("Helvetica")
    .text(
      "Cláusula 2ª — Somente o aluno CONTRATANTE está autorizado a utilizar o serviço.",
      { align: "justify" },
    );

  doc.moveDown(0.5);

  doc
    .font("Helvetica")
    .text(
      "Cláusula 3ª — O transporte refere-se exclusivamente ao horário regular da escola.",
      { align: "justify" },
    );

  doc.moveDown(2);

  doc.text(`${dados.endereco.cidade}, ${dataAtual}`, {
    align: "left",
  });

  doc.moveDown(3);

  doc.text("_________________________________", { align: "left" });
  doc.text(`${dados.contratado.nome}`);
  doc.moveDown(1.5);

  doc.text("_________________________________", { align: "left" });
  doc.text(`${dados.contratante.nome}`);
  doc.end();

  if (!existsSync(pathContrato)) {
    fs.mkdirSync(pathContrato);
  }
  const nomeArquivo = `${dados.aluno.id}-${dados.aluno.nome}.pdf`;
  return `/contratos/${nomeArquivo}`;
}

export default criarContrato;
