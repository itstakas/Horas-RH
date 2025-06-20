const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
let premissas = {
    dias: {},
    inicioNoturno: '22:00',
    fimNoturno: '05:00',
    horaExtra1: '02:00'
};

function abrirConfig() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('modal-config').style.display = 'block';
    gerarConfigDias();
}

function fecharConfig() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('modal-config').style.display = 'none';
}

function gerarConfigDias() {
    const container = document.getElementById('config-dias');
    container.innerHTML = '';
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

    document.getElementById('inicioNoturno').value = premissas.inicioNoturno;
    document.getElementById('fimNoturno').value = premissas.fimNoturno;
    document.getElementById('horaExtra1').value = premissas.horaExtra1;
}

function salvarConfig() {
    for (let i = 1; i <= 7; i++) {
        const entrada = document.getElementById(`entrada${i}`).value;
        const intervalo = document.getElementById(`intervalo${i}`).value;
        const retorno = document.getElementById(`retorno${i}`).value;
        const saida = document.getElementById(`saida${i}`).value;
        premissas.dias[i] = { entrada, intervalo, retorno, saida };

        if (i === 1 && entrada) {
            for (let j = 2; j <= 5; j++) {
                premissas.dias[j] = { entrada, intervalo, retorno, saida };
                document.getElementById(`entrada${j}`).value = entrada;
                document.getElementById(`intervalo${j}`).value = intervalo;
                document.getElementById(`retorno${j}`).value = retorno;
                document.getElementById(`saida${j}`).value = saida;
            }
        }

        const total = calcularDiferenca(entrada, intervalo) + calcularDiferenca(retorno, saida);
        document.getElementById(`total${i}`).innerText = `Total: ${formatarHoras(total)}`;
    }

    premissas.inicioNoturno = document.getElementById('inicioNoturno').value;
    premissas.fimNoturno = document.getElementById('fimNoturno').value;
    premissas.horaExtra1 = document.getElementById('horaExtra1').value;
    localStorage.setItem('premissas', JSON.stringify(premissas));
    fecharConfig();
}

const salvas = localStorage.getItem('premissas');
if (salvas) premissas = JSON.parse(salvas);
