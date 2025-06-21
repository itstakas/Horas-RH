const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

// Estrutura principal de dados do aplicativo
let dadosSistema = {
    perfis: {},
    perfilAtivoId: null
};

// Carrega os dados salvos do LocalStorage ao iniciar
function carregarDados() {
    const dadosSalvos = localStorage.getItem('dadosSistema');
    if (dadosSalvos) {
        dadosSistema = JSON.parse(dadosSalvos);
    } else {
        // Se for o primeiro uso, cria um perfil padrão
        const idPadrao = `perfil_${Date.now()}`;
        dadosSistema.perfis[idPadrao] = {
            id: idPadrao,
            nome: "Padrão",
            dias: { 1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}, 7:{} },
            inicioNoturno: '22:00',
            fimNoturno: '05:00',
            horaExtra1: '02:00'
        };
        dadosSistema.perfilAtivoId = idPadrao;
    }
}

function salvarDados() {
    localStorage.setItem('dadosSistema', JSON.stringify(dadosSistema));
}

function abrirConfig() {
    popularDropdownsDePerfis();
    carregarPerfilParaEdicao(dadosSistema.perfilAtivoId);
    configurarTabs();
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('modal-config').style.display = 'block';
}

function fecharConfig() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('modal-config').style.display = 'none';
    popularDropdownsDePerfis(); // Atualiza o dropdown principal ao fechar
}

function popularDropdownsDePerfis() {
    const selectPrincipal = document.getElementById('perfilPremissa');
    const selectModal = document.getElementById('selectPerfilExistente');
    selectPrincipal.innerHTML = '';
    selectModal.innerHTML = '';

    for (const id in dadosSistema.perfis) {
        const perfil = dadosSistema.perfis[id];
        const option = new Option(perfil.nome, perfil.id);
        const optionModal = new Option(perfil.nome, perfil.id);
        
        selectPrincipal.add(option);
        selectModal.add(optionModal);
    }
    
    selectPrincipal.value = dadosSistema.perfilAtivoId;
    selectModal.value = dadosSistema.perfilAtivoId;
}

function carregarPerfilParaEdicao(perfilId) {
    const perfil = dadosSistema.perfis[perfilId];
    if (!perfil) return;
    
    dadosSistema.perfilAtivoId = perfilId; // Garante que o perfil ativo é o que está sendo editado
    document.getElementById('inputNomePerfil').value = perfil.nome;

    const container = document.querySelector('#modal-config .tab-content');
    container.innerHTML = ''; 

    for (let i = 1; i <= 7; i++) {
        const diaNome = diasSemana[i % 7];
        const diaId = diaNome.toLowerCase().substring(0, 3).replace('á', 'a').replace('ç', 'c');
        const premissaDia = perfil.dias[i] || {};
        const panel = document.createElement('div');
        panel.id = `tab-${diaId}`;
        panel.className = 'tab-panel' + (i === 1 ? ' active' : '');
        panel.innerHTML = `
            <h4>Horários de ${diaNome}</h4>
            <div class="form-group"><label for="entrada${i}">Entrada</label><input type="time" id="entrada${i}" value="${premissaDia.entrada || ''}"></div>
            <div class="form-group"><label for="intervalo${i}">Intervalo</label><input type="time" id="intervalo${i}" value="${premissaDia.intervalo || ''}"></div>
            <div class="form-group"><label for="retorno${i}">Retorno</label><input type="time" id="retorno${i}" value="${premissaDia.retorno || ''}"></div>
            <div class="form-group"><label for="saida${i}">Saída</label><input type="time" id="saida${i}" value="${premissaDia.saida || ''}"></div>
            ${i === 1 ? `<div class="form-group checkbox"><input type="checkbox" id="replicarSegunda"><label for="replicarSegunda">Aplicar para Terça a Sexta</label></div>` : ''}
        `;
        container.appendChild(panel);
    }

    const outrasPanel = document.createElement('div');
    outrasPanel.id = 'tab-outras';
    outrasPanel.className = 'tab-panel';
    outrasPanel.innerHTML = `
        <h4>Outras Configurações</h4>
        <div class="form-group"><label for="inicioNoturno">Início Adic. Noturno</label><input type="time" id="inicioNoturno" value="${perfil.inicioNoturno}"></div>
        <div class="form-group"><label for="fimNoturno">Fim Adic. Noturno</label><input type="time" id="fimNoturno" value="${perfil.fimNoturno}"></div>
        <div class="form-group"><label for="horaExtra1">Limite Hora Extra 1ª Faixa</label><input type="time" id="horaExtra1" value="${perfil.horaExtra1}"></div>
    `;
    container.appendChild(outrasPanel);
    configurarTabs(); // Reconfigura as tabs para os novos painéis
}

function salvarAlteracoesDoPerfil() {
    const perfilId = document.getElementById('selectPerfilExistente').value;
    const perfil = dadosSistema.perfis[perfilId];
    if (!perfil) return;

    perfil.nome = document.getElementById('inputNomePerfil').value;

    const replicar = document.getElementById('replicarSegunda').checked;
    if (replicar) {
        const seg = {
            entrada: document.getElementById('entrada1').value,
            intervalo: document.getElementById('intervalo1').value,
            retorno: document.getElementById('retorno1').value,
            saida: document.getElementById('saida1').value
        };
        perfil.dias[1] = seg;
        for (let i = 2; i <= 5; i++) { perfil.dias[i] = { ...seg }; }
    } else {
        for (let i = 1; i <= 7; i++) {
            perfil.dias[i] = {
                entrada: document.getElementById(`entrada${i}`).value,
                intervalo: document.getElementById(`intervalo${i}`).value,
                retorno: document.getElementById(`retorno${i}`).value,
                saida: document.getElementById(`saida${i}`).value
            };
        }
    }
    
    perfil.inicioNoturno = document.getElementById('inicioNoturno').value;
    perfil.fimNoturno = document.getElementById('fimNoturno').value;
    perfil.horaExtra1 = document.getElementById('horaExtra1').value;

    salvarDados();
    alert(`Perfil "${perfil.nome}" salvo com sucesso!`);
    popularDropdownsDePerfis();
}

function criarNovoPerfil() {
    const nome = prompt("Digite o nome para o novo perfil:", "Novo Perfil");
    if (!nome) return;

    const id = `perfil_${Date.now()}`;
    dadosSistema.perfis[id] = {
        id, nome,
        dias: { 1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}, 7:{} },
        inicioNoturno: '22:00',
        fimNoturno: '05:00',
        horaExtra1: '02:00'
    };
    
    dadosSistema.perfilAtivoId = id;
    salvarDados();
    popularDropdownsDePerfis();
    carregarPerfilParaEdicao(id);
}

function excluirPerfil() {
    const perfilId = document.getElementById('selectPerfilExistente').value;
    if (Object.keys(dadosSistema.perfis).length <= 1) {
        alert("Não é possível excluir o último perfil.");
        return;
    }
    if (confirm(`Tem certeza que deseja excluir o perfil "${dadosSistema.perfis[perfilId].nome}"?`)) {
        delete dadosSistema.perfis[perfilId];
        dadosSistema.perfilAtivoId = Object.keys(dadosSistema.perfis)[0]; // Ativa o primeiro da lista
        salvarDados();
        popularDropdownsDePerfis();
        carregarPerfilParaEdicao(dadosSistema.perfilAtivoId);
    }
}

function configurarTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            const tabId = link.getAttribute('data-tab');
            const panel = document.getElementById(tabId);
            if(panel) {
                link.classList.add('active');
                panel.classList.add('active');
            }
        });
    });
     // Ativa a primeira aba por padrão, se nenhuma estiver ativa
    if (!document.querySelector('.tab-link.active')) {
        document.querySelector('.tab-link').classList.add('active');
        document.querySelector('.tab-panel').classList.add('active');
    }
}