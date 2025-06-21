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
    listaResultados = document.getElementById('listaResultados');
    pesquisa = document.getElementById('pesquisaNome').value.toLowerCase();
    listaCheckBox = document.querySelectorAll('#modal-filtro input')

    document.getElementById('#listaResultados').style.display = 'block';

    let checkBoxSelecionados = Array.from(listaCheckBox)
    checkBoxSelecionados = checkBoxSelecionados.filter(checkBox => checkBox.checked)
    checkBoxSelecionados = checkBoxSelecionados.map(checkBox => checkBox.value)

    //filtra na array funcionários pelo valor pesquisa e unidade selecionada
    const filtrados = funcionarios.filter(e => {
        console.log(checkBoxSelecionados.includes(e.setor))
        return e.nome.toLowerCase().includes(pesquisa) && checkBoxSelecionados.includes(e.setor)
    })

    listaResultados.innerHTML = '';

    filtrados.forEach(f => {
        const li = document.createElement("li");
        li.textContent = `${f.nome} - ${f.setor}`;
        listaResultados.appendChild(li);
    });
}

function fecharBusca() {
    document.querySelector('#listaResultados').style.display = 'none';

}

function abrirFiltro() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('modal-filtro').style.display = 'block';
}

function fecharFiltro() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('modal-filtro').style.display = 'none';
}