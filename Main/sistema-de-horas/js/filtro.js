//adicionar os eventos input,focus e blur ao campo de Pesquisa
const campoPesquisa = document.getElementById('pesquisaNome');
campoPesquisa.addEventListener('input', filtrarFuncionarios);
campoPesquisa.addEventListener('focus', filtrarFuncionarios);
campoPesquisa.addEventListener('blur', fecharBusca);
document.getElementById('filtroBtn').addEventListener('click', abrirFiltro);

//Controle de áreas selecionadas
const filtros = document.getElementById("modal-filtro")
document.getElementById("opçõesFiltro").addEventListener('input', () => { filtros.querySelector('input').checked = false })


//funcionários falsos enquanto não existe um sistema 
const funcionarios = [
    { nome: "Ana Souza", setor: "RH" },
    { nome: "Carlos Lima", setor: "RH" },
    { nome: "Bruno Silva", setor: "TI" },
    { nome: "Mariana Costa", setor: "TI" },
    { nome: "José Oliveira", setor: "Produção" },
    { nome: "Fernanda Rocha", setor: "Produção" },
];

function filtrarFuncionarios() {
    let listaResultados = document.getElementById('listaResultados');
    let listaCheckBox = document.querySelectorAll('#modal-filtro input')
    let pesquisa = campoPesquisa.value.toLowerCase();

    document.querySelector('#listaResultados').style.display = 'block';//mostra a barra de pesquisa

    let checkBoxSelecionados = Array.from(listaCheckBox)
    checkBoxSelecionados = checkBoxSelecionados.filter(checkBox => checkBox.checked)//deixa apenas as selecionadas na lista
    checkBoxSelecionados = checkBoxSelecionados.map(checkBox => checkBox.value)//transforma a lista numa lista com os valores das selecionadas

    //filtra apenas os colaboradores que atendem tanto para a inclusão da str de pesquisa no nome, quanto para a área selecionada
    const filtrados = funcionarios.filter(e => {
        return e.nome.toLowerCase().includes(pesquisa) && checkBoxSelecionados.includes(e.setor)
    })

    listaResultados.innerHTML = '';

    //itera cada um dos filtrados para escrever na tela
    filtrados.forEach(f => {
        const li = document.createElement("li");
        li.textContent = `${f.nome} - ${f.setor}`;
        li.onclick = selecionarColaborador
        listaResultados.appendChild(li);
    });
}

function fecharBusca() {
    setTimeout(() => {
        document.querySelector('#listaResultados').style.display = 'none';
    }, 200); // espera 200 milissegundos (0.2s) para poder registrar o clique
}

function abrirFiltro() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('modal-filtro').style.display = 'block';
}

function fecharFiltro() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('modal-filtro').style.display = 'none';
}

function selecionarColaborador(element) {
    const campoPesquisa = document.getElementById('pesquisaNome');

    campoPesquisa.value = element.target.textContent.split(' -')[0]//Após selecionado mostra apenas o resultado separando a parte da string que mostra a área
    fecharBusca();

    console.log(element.target.textContent);//vai ser substituido por algo mais significativo com a evolução do código
}

function toggleFiltros(e) {//Para a opção todos as áreas de filtro funcionar selecionar e deselecionar
    const container = e.parentNode.parentNode; // sobe até o .grupo
    const inputs = container.querySelectorAll('label input');

    if (e.checked) {
        inputs.forEach((input) => {
            input.checked = true
        })
    } else {
        inputs.forEach((input) => {
            input.checked = false
        })
    }
}