function verificarCampos(campos) {
  for (let campo in campos) {
    let valor = campos[campo];

    if (
      valor === null ||
      valor === undefined ||
      (typeof valor === "string" && valor.trim() === "")
    ) {
      console.log(`Por favor preencha o campo: ${campo}`);
      throw new Error(`Por favor preencha o campo: ${campo}`);
    }
  }
}

export default verificarCampos;
