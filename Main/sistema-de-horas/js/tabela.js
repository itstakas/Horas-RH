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
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0'); // +1 porque os meses começam em 0
        const dataFormatada = `${dia}/${mes}`;

        tr.innerHTML = `
            <td class="cell-data">${dataFormatada}</td>
            <td class="cell-dia">${diasSemana[diaSemana]}</td>
            <td><input type="time"></td>
            <td><input type="time"></td>
            <td><input type="time"></td>
            <td><input type="time"></td>
            <td><input type="time"></td>
            <td><input type="time"></td>
            <td><input type="time"></td>
            <td><input type="time"></td>
            <td class="cell-saldo"></td>
            <td class="cell-he"></td>
            <td class="cell-noturno"></td>
            <td class="cell-atraso"></td>
            <td class="cell-h1"></td>
            <td class="cell-h2"></td>
            <td class="areaBtn"><button class="btn-falta">Atribuir Falta</button></td>
            <td class="areaBtn"><button class="btn-atestado"> Atestado </button></td>
        `;
        tbody.appendChild(tr);

        const btnFalta = tr.querySelector('.btn-falta');
        btnFalta.addEventListener('click', () => toggleFalta(btnFalta));

        const btnAtestado = tr.querySelector('.btn-atestado');
        btnAtestado.addEventListener('click', () => toggleAtestado(btnAtestado));
    }

    calcular()
}

function toggleFalta(btn) {
    const linha = btn.parentElement.parentElement;
    const inputs = linha.querySelectorAll('input');
    const saldo = linha.querySelector('.cell-saldo');

    //Checa se o funcionário já está marcado como atestado, caso sim alerta e sai da função
    if (linha.classList.contains('linha-atestado')) {
        alert('O funcionário está com atestado para o dia');
        return
    }

    if (linha.classList.contains('linha-falta')) {
        // Reativa os inputs
        inputs.forEach(i => i.disabled = false);
        saldo.innerText = '';

        btn.innerText = 'Atribuir Falta';
        linha.classList.remove('linha-falta');

        calcular()//Calcula quando tira a falta para os valores calculados voltarem a aparecer

    } else {
        // --- Ação de ADICIONAR a falta ---
        inputs.forEach(i => i.disabled = true);
        const diaSemanaText = linha.querySelector('.cell-dia').innerText;
        const diaSemana = diasSemana.indexOf(diaSemanaText);
        const premissa = premissas.dias[(diaSemana === 0) ? 7 : diaSemana] || {};

        if (premissa.entrada && premissa.saida) {
            const total = calcularDiferenca(premissa.entrada, premissa.intervalo) + calcularDiferenca(premissa.retorno, premissa.saida);
            saldo.innerText = `${formatarHoras(total)}`;
        } else {
            saldo.innerText = '00:00';
        }

        const listaCampos = Array.from(linha.querySelectorAll('td')).slice(11, 16); //pega as células 11 à 16 da linha 
        listaCampos.forEach(campo => campo.innerText = '00:00')

        btn.innerText = 'Remover';
        console.log(linha)
        linha.classList.add('linha-falta'); // ADICIONADO: Adiciona a classe na linha
    }

}


// Ativa/desativa atestado em um dia
function toggleAtestado(btn) {
    const linha = btn.parentElement.parentElement;
    const inputs = linha.querySelectorAll('input');

    //Checa se o funcionário já está marcado como falta, caso sim alerta e sai da função
    if (linha.classList.contains('linha-falta')) {
        alert('O funcionário está com falta para o dia');
        return
    }

    //temporário enquanto n tiver um sistema
    const premissa = ['07:00', '11:00', '13:00', '17:00', '00:00', '00:00', '00:00', '00:00'];


    if (linha.classList.contains('linha-atestado')) {
        for (let elemento of inputs) {
            elemento.value = '';
            elemento.disabled = false;
        }
        linha.classList.remove('linha-atestado');

    } else {
        for (let [i, elemento] of inputs.entries()) {//itera o par ordenado de [indíce e elemento] que o entries() gera do nodelist "inputs"
            elemento.value = premissa[i];
            elemento.disabled = true;
        }
        linha.classList.add('linha-atestado');
    }

    calcular()//chama função para recalcular os resultados
}



