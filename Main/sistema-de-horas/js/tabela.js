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

        const premissaDia = premissas.dias[(diaSemana === 0) ? 7 : diaSemana] || {};
        
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${diasSemana[diaSemana]}</td>
            <td><input type="time" value="${premissaDia.entrada || ''}"></td>
            <td><input type="time" value="${premissaDia.intervalo || ''}"></td>
            <td><input type="time" value="${premissaDia.retorno || ''}"></td>
            <td><input type="time" value="${premissaDia.saida || ''}"></td>
            <td><input type="time"></td>
            <td><input type="time"></td>
            <td><input type="time"></td>
            <td><input type="time"></td>
            <td class="saldo"></td>
            <td class="he"></td>
            <td class="noturno"></td>
            <td class="atraso"></td>
            <td class="h1"></td>
            <td class="h2"></td>
            <td><button onclick="toggleFalta(this)">Atribuir Falta</button></td>
        `;
        tbody.appendChild(tr);
    }
}

function toggleFalta(btn) {
    const linha = btn.parentElement.parentElement;
    const inputs = linha.querySelectorAll('input');
    const saldo = linha.querySelector('.saldo');
    if (btn.classList.contains('faltou')) {
        inputs.forEach(i => i.disabled = false);
        saldo.innerText = '';
        btn.classList.remove('faltou');
        btn.innerText = 'Atribuir Falta';
    } else {
        inputs.forEach(i => i.disabled = true);
        const diaSemana = diasSemana.indexOf(linha.children[1].innerText);
        const premissa = premissas.dias[(diaSemana === 0) ? 7 : diaSemana];
        const total = calcularDiferenca(premissa.entrada, premissa.intervalo) + calcularDiferenca(premissa.retorno, premissa.saida);
        saldo.innerText = `-${formatarHoras(total)}`;
        btn.classList.add('faltou');
        btn.innerText = 'Remover Falta';
    }
}
