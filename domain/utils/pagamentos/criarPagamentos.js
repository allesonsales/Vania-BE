import Pagamento from "../../models/Pagamento.js";

async function criarPagamento(usuarioId, contrato, transaction) {
  let dataBase = new Date(contrato.inicio);
  const diaOriginal = dataBase.getDate();

  console.log("Inicio contrato:", contrato.inicio);

  for (let i = 0; i < contrato.tempo_contrato; i++) {
    const ano = dataBase.getFullYear();
    const mes = dataBase.getMonth() + i;

    const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate();

    const diaFinal = Math.min(diaOriginal, ultimoDiaDoMes);

    const dataVencimentoGerada = new Date(ano, mes, diaFinal);

    const dadosPagamento = {
      usuario_id: usuarioId,
      responsavel_id: contrato.responsavel_id,
      status: 1,
      valor: contrato.valor_mensalidade,
      pago_em: null,
      tipo_pagamento: null,
      data_vencimento: dataVencimentoGerada,
    };

    await Pagamento.create(dadosPagamento, { transaction });
  }
}

export default criarPagamento;
