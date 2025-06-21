function gerarTabela() {
    const tbody = document.getElementById('tabela');
    tbody.innerHTML = '';
    const mesSelecionado = document.getElementById('mesSelecionado').value;
    if (!mesSelecionado) return alert('Selecione um mês');

    const [ano, mes] = mesSelecionado.split('-').map(Number);
    const inicio = new Date(ano, mes - 1, 24);
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
            <td class="areaBtn"><button onclick="toggleFalta(this)">Atribuir Falta</button></td>
            <td class="areaBtn"><button onclick="toggleAtestado(this)"> Atestado </button></td>
        `;
        tbody.appendChild(tr);
    }
}

function toggleFalta(btn) {
    const linha = btn.parentElement.parentElement;
    const inputs = linha.querySelectorAll('input');
    const saldo = linha.querySelector('.saldo');

    //Checa se o funcionário já está marcado como atestado, caso sim alerta e sai da função
    if (linha.querySelector('.atestado')){
        alert('O funcionário está com atestado para o dia');
        return
    }

    if (btn.classList.contains('faltou')) {
        // Reativa os inputs
        inputs.forEach(i => i.disabled = false);
        saldo.innerText = '';
        btn.classList.remove('faltou');
        btn.innerText = 'Atribuir Falta';

        calcular() //Calcula quando tira a falta para os valores calculados voltarem a aparecer
    } else {
        // Bloqueia os inputs e aplica falta
        inputs.forEach(i => i.disabled = true);
        const diaSemana = diasSemana.indexOf(linha.children[1].innerText);
        const premissa = premissas.dias[(diaSemana === 0) ? 7 : diaSemana];
        const total = calcularDiferenca(premissa.entrada, premissa.intervalo) + calcularDiferenca(premissa.retorno, premissa.saida);
        saldo.innerText = `${formatarHoras(total)}`;
        btn.classList.add('faltou');
        btn.innerText = 'Remover Falta';
    }
}

// Ativa/desativa atestado em um dia
function toggleAtestado(btn) {
    const linha = btn.parentElement.parentElement;
    const inputs = linha.querySelectorAll('input');

    //Checa se o funcionário já está marcado como falta, caso sim alerta e sai da função
    if (linha.querySelector('.faltou')){
        alert('O funcionário está com falta para o dia');
        return
    }

    //temporário enquanto n tiver um sistema
    const premissa = ['07:00','11:00','13:00','17:00', '00:00', '00:00', '00:00', '00:00'];


    if(btn.classList.contains('atestado')) {
        for(let elemento of inputs) {
            elemento.value = '';
            elemento.disabled = false;
        }
        btn.classList.remove('atestado');
        
    } else {
        for(let [i,elemento] of inputs.entries()) {//itera o par ordenado de [indíce e elemento] que o entries() gera do nodelist "inputs"
            elemento.value = premissa[i];
            elemento.disabled = true;
        }
        btn.classList.add('atestado'); 
    }

    calcular()//chama função para recalcular os resultados
} 


