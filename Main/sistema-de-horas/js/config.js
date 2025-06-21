const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
let premissas = {
    dias: { 1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}, 7:{} },
    inicioNoturno: '22:00',
    fimNoturno: '05:00',
    horaExtra1: '02:00'
};

// Carrega as premissas salvas no LocalStorage
const salvas = localStorage.getItem('premissas');
if (salvas) {
    premissas = JSON.parse(salvas);
}

function abrirConfig() {
    gerarConfigDias(); // Gera o conteúdo das abas
    configurarTabs(); // Ativa a lógica de clique nas abas
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('modal-config').style.display = 'block';
}

function fecharConfig() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('modal-config').style.display = 'none';
}

function gerarConfigDias() {
    const container = document.querySelector('#modal-config .tab-content');
    container.innerHTML = ''; // Limpa o conteúdo anterior

    // Gera painéis para Segunda a Domingo (índices 1 a 7)
    for (let i = 1; i <= 7; i++) {
        const diaNome = diasSemana[i % 7];
        const diaId = diaNome.toLowerCase().substring(0, 3).replace('á', 'a').replace('ç', 'c');
        const premissaDia = premissas.dias[i] || {};

        const panel = document.createElement('div');
        panel.id = `tab-${diaId}`;
        panel.className = 'tab-panel' + (i === 1 ? ' active' : ''); // Ativa a primeira aba

        panel.innerHTML = `
            <h4>Horários de ${diaNome}</h4>
            <div class="form-group">
                <label for="entrada${i}">Entrada</label>
                <input type="time" id="entrada${i}" value="${premissaDia.entrada || ''}">
            </div>
            <div class="form-group">
                <label for="intervalo${i}">Intervalo</label>
                <input type="time" id="intervalo${i}" value="${premissaDia.intervalo || ''}">
            </div>
            <div class="form-group">
                <label for="retorno${i}">Retorno</label>
                <input type="time" id="retorno${i}" value="${premissaDia.retorno || ''}">
            </div>
            <div class="form-group">
                <label for="saida${i}">Saída</label>
                <input type="time" id="saida${i}" value="${premissaDia.saida || ''}">
            </div>
            ${i === 1 ? `
                <div class="form-group checkbox">
                    <input type="checkbox" id="replicarSegunda">
                    <label for="replicarSegunda">Aplicar estes horários para Terça a Sexta</label>
                </div>
            ` : ''}
        `;
        container.appendChild(panel);
    }

    // Gera painel para "Outras Configurações"
    const outrasPanel = document.createElement('div');
    outrasPanel.id = 'tab-outras';
    outrasPanel.className = 'tab-panel';
    outrasPanel.innerHTML = `
        <h4>Outras Configurações</h4>
        <div class="form-group">
            <label for="inicioNoturno">Início Adic. Noturno</label>
            <input type="time" id="inicioNoturno" value="${premissas.inicioNoturno}">
        </div>
        <div class="form-group">
            <label for="fimNoturno">Fim Adic. Noturno</label>
            <input type="time" id="fimNoturno" value="${premissas.fimNoturno}">
        </div>
        <div class="form-group">
            <label for="horaExtra1">Limite Hora Extra 1ª Faixa</label>
            <input type="time" id="horaExtra1" value="${premissas.horaExtra1}">
        </div>
    `;
    container.appendChild(outrasPanel);
}

function salvarConfig() {
    const replicar = document.getElementById('replicarSegunda').checked;

    if (replicar) {
        const seg = {
            entrada: document.getElementById('entrada1').value,
            intervalo: document.getElementById('intervalo1').value,
            retorno: document.getElementById('retorno1').value,
            saida: document.getElementById('saida1').value
        };
        premissas.dias[1] = seg;
        // Aplica para Terça (2) a Sexta (5)
        for (let i = 2; i <= 5; i++) {
            premissas.dias[i] = { ...seg };
        }
    } else {
        // Salva cada dia individualmente
        for (let i = 1; i <= 7; i++) {
            premissas.dias[i] = {
                entrada: document.getElementById(`entrada${i}`).value,
                intervalo: document.getElementById(`intervalo${i}`).value,
                retorno: document.getElementById(`retorno${i}`).value,
                saida: document.getElementById(`saida${i}`).value
            };
        }
    }
    
    // Salva as outras configurações
    premissas.inicioNoturno = document.getElementById('inicioNoturno').value;
    premissas.fimNoturno = document.getElementById('fimNoturno').value;
    premissas.horaExtra1 = document.getElementById('horaExtra1').value;

    localStorage.setItem('premissas', JSON.stringify(premissas));
    fecharConfig();
}

function configurarTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Desativa todas as abas e painéis
            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            // Ativa a aba e o painel clicado
            const tabId = link.getAttribute('data-tab');
            const panel = document.getElementById(tabId);
            
            link.classList.add('active');
            panel.classList.add('active');
        });
    });
}