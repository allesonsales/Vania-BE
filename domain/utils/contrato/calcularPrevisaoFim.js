export default function calcularPrevisaoFim(inicioContrato, tempoContrato) {
  const dataInicio = new Date(inicioContrato);

  const dataFim = new Date(dataInicio);
  dataFim.setMonth(dataFim.getMonth() + Number(tempoContrato));

  return dataFim;
}
