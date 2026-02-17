async function verificarHorario(
  horaInicioIda,
  horaFimIda,
  horaInicioVolta,
  horaFimVolta,
) {
  const horaParaMinutos = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  };

  if (horaParaMinutos(horaInicioIda) >= horaParaMinutos(horaFimIda)) {
    return {
      valido: false,
      message: "O horário de início da ida deve ser menor que o horário final.",
      status: "error",
    };
  }

  if (horaParaMinutos(horaInicioVolta) >= horaParaMinutos(horaFimVolta)) {
    return {
      valido: false,
      message:
        "O horário de início da volta deve ser menor que o horário final.",
      status: "error",
    };
  }

  return { valido: true };
}

export default verificarHorario;
