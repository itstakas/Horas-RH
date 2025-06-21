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
            <td><button class="btn-falta">Falta</button></td>
        `;
        tbody.appendChild(tr);

        const btnFalta = tr.querySelector('.btn-falta');
        btnFalta.addEventListener('click', () => toggleFalta(btnFalta));
    }
}

function toggleFalta(btn) {
    const linha = btn.parentElement.parentElement;
    const inputs = linha.querySelectorAll('input');
    const saldo = linha.querySelector('.cell-saldo');

    const perfilAtivo = dadosSistema.perfis[dadosSistema.perfilAtivoId];
    if (!perfilAtivo) {
        alert("Nenhum perfil de premissa ativo. Configure um no gerenciador.");
        return;
    }

    if (btn.classList.contains('faltou')) {
        inputs.forEach(i => i.disabled = false);
        saldo.innerText = '';
        btn.classList.remove('faltou');
        btn.innerText = 'Falta';
        linha.classList.remove('linha-falta');
    } else {
        inputs.forEach(i => i.disabled = true);
        const diaSemanaText = linha.querySelector('.cell-dia').innerText;
        const diaSemana = diasSemana.indexOf(diaSemanaText);
        const premissaDoDia = perfilAtivo.dias[(diaSemana === 0) ? 7 : diaSemana] || {};
        
        if (premissaDoDia.entrada && premissaDoDia.saida) {
            const total = calcularDiferenca(premissaDoDia.entrada, premissaDoDia.intervalo) + calcularDiferenca(premissaDoDia.retorno, premissaDoDia.saida);
            saldo.innerText = `-${formatarHoras(total)}`;
        } else {
            saldo.innerText = '-00:00';
        }
        
        btn.classList.add('faltou');
        btn.innerText = 'Remover';
        linha.classList.add('linha-falta');
    }
}