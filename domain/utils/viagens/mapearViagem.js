export function mapearViagem(viagem) {
  if (!viagem) return null;

  console.log("viagem no map", viagem);

  const rota = viagem.rota;

  const escolas = rota.rota_alunos.reduce((acc, item) => {
    const aluno = item.aluno;
    const escola = aluno.escola;

    const escolaExistente = acc.find((e) => e.id === escola.id);

    if (escolaExistente) {
      escolaExistente.alunos.push({
        id: aluno.id,
        nome: aluno.nome,
      });
    } else {
      acc.push({
        id: escola.id,
        nome: escola.nome,
        alunos: [
          {
            id: aluno.id,
            nome: aluno.nome,
          },
        ],
      });
    }

    return acc;
  }, []);

  return {
    rota_id: rota.id,
    nome_rota: rota.nome,
    hora_inicio_ida: rota.hora_inicio_ida,
    hora_fim_ida: rota.hora_fim_ida,
    hora_inicio: viagem.hora_inicio ?? null,
    hora_inicio_volta: rota.hora_inicio_volta,
    hora_fim_volta: rota.hora_fim_volta,
    id: viagem.id,
    escolas,
  };
}
