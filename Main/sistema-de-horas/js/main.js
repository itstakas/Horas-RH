// A "mágica" acontece aqui. O código dentro só roda
// depois que todo o HTML foi carregado.
document.addEventListener('DOMContentLoaded', function() {
    
    // Conectando os botões às suas funções
    document.getElementById('btnGerar').addEventListener('click', gerarTabela);
    document.getElementById('btnPremissas').addEventListener('click', abrirConfig);
    document.getElementById('btnCalcular').addEventListener('click', calcular);
    document.getElementById('btnSalvarConfig').addEventListener('click', salvarConfig);
    document.getElementById('btnFecharConfig').addEventListener('click', fecharConfig);

});


// As definições das funções ficam fora, pois não dependem do DOM para serem criadas.
function calcular() {
    const linhas = document.querySelectorAll('#tabela tr');
    let totalSaldo = 0, totalHE = 0, totalNoturno = 0, totalAtraso = 0, totalH1 = 0, totalH2 = 0;

    linhas.forEach(linha => {
        const inputs = linha.querySelectorAll('input');
        if (inputs.length === 0) return;

        let normal = calcularDiferenca(inputs[0].value, inputs[1].value) + calcularDiferenca(inputs[2].value, inputs[3].value);
        let sobre = calcularDiferenca(inputs[4].value, inputs[5].value) + calcularDiferenca(inputs[6].value, inputs[7].value);
        const saldo = normal + sobre;
        
        linha.querySelector('.cell-saldo').innerText = formatarHoras(saldo);
        totalSaldo += saldo;

        const diaSemanaText = linha.querySelector('.cell-dia').innerText;
        const diaSemana = diasSemana.indexOf(diaSemanaText);
        const premissa = premissas.dias[(diaSemana === 0) ? 7 : diaSemana] || {};
        
        if (premissa.entrada && premissa.saida) {
            const jornada = calcularDiferenca(premissa.entrada, premissa.intervalo) + calcularDiferenca(premissa.retorno, premissa.saida);
            let atraso = 0;
            if (inputs[0].value) { atraso += Math.max(0, calcularDiferenca(premissa.entrada, inputs[0].value) - 10/60); }
            if (inputs[2].value) { atraso += Math.max(0, calcularDiferenca(premissa.retorno, inputs[2].value) - 10/60); }
            linha.querySelector('.cell-atraso').innerText = formatarHoras(atraso);
            totalAtraso += atraso;
    
            const he = Math.max(0, saldo - jornada - 10/60);
            linha.querySelector('.cell-he').innerText = formatarHoras(he);
            totalHE += he;
    
            const h1Limite = horaParaDecimal(premissas.horaExtra1);
            const h1 = Math.min(he, h1Limite);
            const h2 = Math.max(0, he - h1Limite);
            linha.querySelector('.cell-h1').innerText = formatarHoras(h1);
            linha.querySelector('.cell-h2').innerText = formatarHoras(h2);
            totalH1 += h1;
            totalH2 += h2;
        } else {
            linha.querySelector('.cell-atraso').innerText = '';
            linha.querySelector('.cell-he').innerText = '';
            linha.querySelector('.cell-h1').innerText = '';
            linha.querySelector('.cell-h2').innerText = '';
        }

        const noturno = calcularNoturno(inputs[0].value, inputs[3].value) + calcularNoturno(inputs[4].value, inputs[7].value);
        linha.querySelector('.cell-noturno').innerText = formatarHoras(noturno);
        totalNoturno += noturno;
    });

    document.getElementById('totais').innerText =
        `Saldo: ${formatarHoras(totalSaldo)} | HE: ${formatarHoras(totalHE)} | Noturno: ${formatarHoras(totalNoturno)} | Atrasos: ${formatarHoras(totalAtraso)} | HE1: ${formatarHoras(totalH1)} | HE2: ${formatarHoras(totalH2)}`;
}