// Array com os dias da semana
const diasSemana = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

// Objeto com as premissas da jornada de trabalho
let premissas = { 
    dias: {},                    // Armazena os horários padrão por dia
    inicioNoturno: '22:00',     // Início do horário noturno
    fimNoturno: '05:00',        // Fim do horário noturno
    horaExtra1: '02:00'         // Limite para hora extra tipo 1
};

document.getElementById('overlay').addEventListener('click', fecharConfig); //fecha ao clicar fora da janela

// Abre o modal de configuração
function abrirConfig() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('modal-config').style.display = 'block';
    gerarConfigDias(); // Gera os inputs de configuração de dias
}

// Fecha o modal de configuração
function fecharConfig() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('modal-config').style.display = 'none';
}

// Gera dinamicamente os campos de horário para cada dia da semana
function gerarConfigDias() {
    const container = document.getElementById('config-dias');
    container.innerHTML = '';

    // De 1 (Segunda) até 7 (Domingo)
    for (let i = 1; i <= 7; i++) {
        const div = document.createElement('div');
        div.innerHTML = `
            <h4>${diasSemana[i % 7]}</h4>
            Entrada <input type="time" id="entrada${i}"><br>
            Intervalo <input type="time" id="intervalo${i}"><br>
            Retorno <input type="time" id="retorno${i}"><br>
            Saída <input type="time" id="saida${i}"><br>
            <small id="total${i}"></small>
        `;
        container.appendChild(div);
    }

    // Preenche os campos noturnos e de hora extra com os valores atuais
    document.getElementById('inicioNoturno').value = premissas.inicioNoturno;
    document.getElementById('fimNoturno').value = premissas.fimNoturno;
    document.getElementById('horaExtra1').value = premissas.horaExtra1;
}

// Salva as configurações de horários padrão por dia
function salvarConfig() {
    for (let i = 1; i <= 7; i++) {
        const entrada = document.getElementById(`entrada${i}`).value;
        const intervalo = document.getElementById(`intervalo${i}`).value;
        const retorno = document.getElementById(`retorno${i}`).value;
        const saida = document.getElementById(`saida${i}`).value;
        premissas.dias[i] = {entrada, intervalo, retorno, saida};

        // Se for segunda-feira (i === 1), aplica os mesmos horários para terça a sexta
        if (i === 1 && entrada) {
            for (let j = 2; j <= 5; j++) {
                premissas.dias[j] = {entrada, intervalo, retorno, saida};
                document.getElementById(`entrada${j}`).value = entrada;
                document.getElementById(`intervalo${j}`).value = intervalo;
                document.getElementById(`retorno${j}`).value = retorno;
                document.getElementById(`saida${j}`).value = saida;
            }
        }

        // Calcula e mostra o total de horas diárias
        const total = calcularDiferenca(entrada, intervalo) + calcularDiferenca(retorno, saida);
        document.getElementById(`total${i}`).innerText = `Total: ${formatarHoras(total)}`;
    }

    // Atualiza valores das premissas gerais
    premissas.inicioNoturno = document.getElementById('inicioNoturno').value;
    premissas.fimNoturno = document.getElementById('fimNoturno').value;
    premissas.horaExtra1 = document.getElementById('horaExtra1').value;

    localStorage.setItem('premissas', JSON.stringify(premissas)) //salva premissas e evite perca no f5

    fecharConfig(); // Fecha o modal após salvar
}

window.onload = () =>{
    const salvas = localStorage.getItem('premissas');
    if (salvas) premissas = JSON.parse(salvas)
}

// Gera a tabela de dias entre 24 do mês anterior e 26 do mês atual
function gerarTabela() {
    const tbody = document.getElementById('tabela');
    tbody.innerHTML = '';
    const mesSelecionado = document.getElementById('mesSelecionado').value;

    if (!mesSelecionado) return alert('Selecione um mês');

    const [ano, mes] = mesSelecionado.split('-').map(Number);
    const inicio = new Date(ano, mes -1, 24);
    const fim = new Date(ano, mes, 26);

    for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
        const tr = document.createElement('tr');
        const diaSemana = d.getDay();
        const dataFormatada = d.toISOString().split('T')[0];
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${diasSemana[diaSemana]}</td>
            <td><input type="time"></td><td><input type="time"></td>
            <td><input type="time"></td><td><input type="time"></td>
            <td><input type="time"></td><td><input type="time"></td>
            <td><input type="time"></td><td><input type="time"></td>
            <td class="saldo"></td><td class="he"></td>
            <td class="noturno"></td><td class="atraso"></td>
            <td class="h1"></td><td class="h2"></td>
            <td><button onclick="toggleFalta(this)">Atribuir Falta</button></td>
        `;
        tbody.appendChild(tr);

        //preenche automaticammente os horarios ao gerar a tabela segundo a premissa
        const premissa = premissa.dias[(diasSemana === 0) ? 7 : diaSemana];
        if (premissa){
            inputs[0].value = premissa.entrada || '';
            inputs[1].value = premissa.intervalo || '';
            inputs[2].value = premissa.retorno || '';
            inputs[3].value = premissa.saida || '';

        }
    }

}

// Ativa/desativa a falta em um dia e bloqueia os inputs
function toggleFalta(btn) {
    const linha = btn.parentElement.parentElement;
    const inputs = linha.querySelectorAll('input');
    const saldo = linha.querySelector('.saldo');

    if (btn.classList.contains('faltou')) {
        // Reativa os inputs
        inputs.forEach(i => i.disabled = false);
        saldo.innerText = '';
        btn.classList.remove('faltou');
        btn.innerText = 'Atribuir Falta';
    } else {
        // Bloqueia os inputs e aplica falta
        inputs.forEach(i => i.disabled = true);
        const diaSemana = diasSemana.indexOf(linha.children[1].innerText);
        const premissa = premissas.dias[(diaSemana === 0) ? 7 : diaSemana];
        const total = calcularDiferenca(premissa.entrada, premissa.intervalo) + calcularDiferenca(premissa.retorno, premissa.saida);
        saldo.innerText = `-${formatarHoras(total)}`;
        btn.classList.add('faltou');
        btn.innerText = 'Remover Falta';
    }
}

// Calcula o total de horas, extras, atrasos e noturnas
function calcular() {
    const linhas = document.querySelectorAll('#tabela tr');
    let totalSaldo = 0, totalHE = 0, totalNoturno = 0, totalAtraso = 0, totalH1 = 0, totalH2 = 0;

    linhas.forEach(linha => {
        const cells = linha.querySelectorAll('td');
        const inputs = linha.querySelectorAll('input');
        if (inputs.length === 0) return;

        // Horas normais e sobrejornada
        let normal = calcularDiferenca(inputs[0].value, inputs[1].value) + calcularDiferenca(inputs[2].value, inputs[3].value);
        let sobre = calcularDiferenca(inputs[4].value, inputs[5].value) + calcularDiferenca(inputs[6].value, inputs[7].value);
        const saldo = normal + sobre;
        cells[10].innerText = formatarHoras(saldo);
        totalSaldo += saldo;

        // Carga horária padrão do dia
        const diaSemana = diasSemana.indexOf(cells[1].innerText);
        const premissa = premissas.dias[(diaSemana === 0) ? 7 : diaSemana];
        const jornada = calcularDiferenca(premissa.entrada, premissa.intervalo) + calcularDiferenca(premissa.retorno, premissa.saida);

        // Atrasos (descontando 10 minutos de tolerância)
        let atraso = 0;
        atraso += Math.max(0, calcularDiferenca(premissa.entrada, inputs[0].value) - 10/60);
        atraso += Math.max(0, calcularDiferenca(premissa.retorno, inputs[2].value) - 10/60);
        cells[13].innerText = formatarHoras(atraso);
        totalAtraso += atraso;

        // Hora extra total (descontando tolerância)
        const he = Math.max(0, saldo - jornada - 10/60);
        cells[11].innerText = formatarHoras(he);
        totalHE += he;

        // Hora extra 1 e 2 (separadas por limite)
        const h1Limite = horaParaDecimal(premissas.horaExtra1);
        const h1 = Math.min(he, h1Limite);
        const h2 = Math.max(0, he - h1Limite);
        cells[14].innerText = formatarHoras(h1);
        cells[15].innerText = formatarHoras(h2);
        totalH1 += h1;
        totalH2 += h2;

        // Horas noturnas
        const noturno = calcularNoturno(inputs[0].value, inputs[3].value) + calcularNoturno(inputs[4].value, inputs[7].value);
        cells[12].innerText = formatarHoras(noturno);
        totalNoturno += noturno;
    });

    // Exibe o total de tudo
    document.getElementById('totais').innerText = `Saldo: ${formatarHoras(totalSaldo)} | HE: ${formatarHoras(totalHE)} | Noturno: ${formatarHoras(totalNoturno)} | Atrasos: ${formatarHoras(totalAtraso)} | HE1: ${formatarHoras(totalH1)} | HE2: ${formatarHoras(totalH2)}`;
}

// Calcula a diferença entre dois horários no formato HH:MM em horas decimais
function calcularDiferenca(inicio, fim) {
    if (!inicio || !fim) return 0;
    const i = horaParaDecimal(inicio);
    const f = horaParaDecimal(fim);
    return (f >= i) ? f - i : (24 - i) + f; // Considera virada de dia
}

// Calcula tempo noturno entre dois horários
function calcularNoturno(ini, fim) {
    if (!ini || !fim) return 0;
    const i = horaParaDecimal(ini);
    const f = horaParaDecimal(fim);
    const ni = horaParaDecimal(premissas.inicioNoturno);
    const nf = horaParaDecimal(premissas.fimNoturno);
    let total = 0;

    // Loop de 1 em 1 minuto decimal (0.01 ≈ 1 min)
    for (let h = i; h != f; h = (h + 0.01) % 24) {
        const hCorr = Math.floor(h) + ((h % 1) * 60 / 100);
        if (ni < nf) {
            if (hCorr >= ni && hCorr < nf) total += 1/60;
        } else {
            if (hCorr >= ni || hCorr < nf) total += 1/60;
        }
        if (Math.abs(h - f) < 0.02) break;
    }
    return total;
}

// Converte horário no formato HH:MM para decimal (ex: 01:30 => 1.5)
function horaParaDecimal(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return h + m/60;
}

// Formata horas decimais para HH:MM (ex: 1.5 => 01:30)
function formatarHoras(decimal) {
    const sinal = decimal < 0 ? '-' : '';
    const abs = Math.abs(decimal);
    const h = Math.floor(abs);
    const m = Math.round((abs - h) * 60);
    return `${sinal}${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}
