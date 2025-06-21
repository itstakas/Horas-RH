document.getElementById('btnGerar').addEventListener('click', gerarTabela);
document.getElementById('btnPremissas').addEventListener('click', abrirConfig);
document.getElementById('btnCalcular').addEventListener('click', calcular);
document.getElementById('btnSalvarConfig').addEventListener('click', salvarConfig);
document.getElementById('btnFecharConfig').addEventListener('click', fecharConfig);
//event listeners para automatizar a geração e atualização da tabela
document.getElementById('mesSelecionado').addEventListener('change', gerarTabela)
document.getElementById('tabela').addEventListener('input', calcular)

function calcular() {
    const linhas = document.querySelectorAll('#tabela tr');
    let totalSaldo = 0, totalHE = 0, totalNoturno = 0, totalAtraso = 0, totalH1 = 0, totalH2 = 0;

    linhas.forEach(linha => {
        const cells = linha.querySelectorAll('td');
        const inputs = linha.querySelectorAll('input');
        if (inputs.length === 0) return;

        let normal = calcularDiferenca(inputs[0].value, inputs[1].value) + calcularDiferenca(inputs[2].value, inputs[3].value);
        let sobre = calcularDiferenca(inputs[4].value, inputs[5].value) + calcularDiferenca(inputs[6].value, inputs[7].value);
        const saldo = normal + sobre;
        cells[10].innerText = formatarHoras(saldo);
        totalSaldo += saldo;
        const premissa = premissas.dias[(diaSemana === 0) ? 7 : diaSemana];
        const jornada = calcularDiferenca(premissa.entrada, premissa.intervalo) + calcularDiferenca(premissa.retorno, premissa.saida);

        let atraso = 0;
        atraso += Math.max(0, calcularDiferenca(premissa.entrada, inputs[0].value) - 10 / 60);
        atraso += Math.max(0, calcularDiferenca(premissa.retorno, inputs[2].value) - 10 / 60);
        cells[13].innerText = formatarHoras(atraso);
        totalAtraso += atraso;

        const he = Math.max(0, saldo - jornada - 10 / 60);
        cells[11].innerText = formatarHoras(he);
        totalHE += he;

        const h1Limite = horaParaDecimal(premissas.horaExtra1);
        const h1 = Math.min(he, h1Limite);
        const h2 = Math.max(0, he - h1Limite);
        cells[14].innerText = formatarHoras(h1);
        cells[15].innerText = formatarHoras(h2);
        totalH1 += h1;
        totalH2 += h2;

        const noturno = calcularNoturno(inputs[0].value, inputs[3].value) + calcularNoturno(inputs[4].value, inputs[7].value);
        cells[12].innerText = formatarHoras(noturno);
        totalNoturno += noturno;
    });

    document.getElementById('totais').innerText =
        `Saldo: ${formatarHoras(totalSaldo)} | HE: ${formatarHoras(totalHE)} | Noturno: ${formatarHoras(totalNoturno)} | Atrasos: ${formatarHoras(totalAtraso)} | HE1: ${formatarHoras(totalH1)} | HE2: ${formatarHoras(totalH2)}`;
}
