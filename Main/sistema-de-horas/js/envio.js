document.getElementById('btnEnviar').addEventListener('click', enviarJson);

function criarJson() {
    const colaboradorSelecionado = document.getElementById('pesquisaNome').value;
    const strMesAno = document.getElementById('mesSelecionado').value;
    const [ano, mes] = strMesAno.split('-');
    //const diasMes = new Date(ano, mes, 0).getDate();
    const diasMes = document.getElementById('tabela').querySelectorAll('tr');
    const premissaSelecionada = 'Tipo 1'//vai ter algo aqui quando tivermos um seletor de premissas

    const dados = {}//depois vai ser alinhado para pegar de um bd

    let dias = {};

    //Protótipo de como os dados podem ser  organizados
    document.querySelectorAll('#tabela tr').forEach(linha => { 
        const data = linha.querySelector('.cell-data').innerText + '/' + ano;

        dias[data] = {
            saldo: linha.querySelector('.cell-saldo').innerText,
            he: linha.querySelector('.cell-he').innerText,
            noturno: linha.querySelector('.cell-noturno').innerText,
            atraso: linha.querySelector('.cell-atraso').innerText,
            h1: linha.querySelector('.cell-h1').innerText,
            h2: linha.querySelector('.cell-h2').innerText
        };
    });
    const dadosColaborador = {
        nome: colaboradorSelecionado,
        premissa: premissaSelecionada,
        mes: mes,
        dias,
    };

    dados[colaboradorSelecionado + strMesAno] = dadosColaborador;

    for (const chave in dados) {
        const colaborador = dados[chave];
        console.log(`\n--- ${chave} ---`);
        console.log(`Nome: ${colaborador.nome}`);
        console.log(`Premissa: ${colaborador.premissa}`);
        console.log(`Mês: ${colaborador.mes}`);
        console.log(`Dias:`);

        for (const dia in colaborador.dias) {
            const info = colaborador.dias[dia];
            console.log(`  ${dia}:`);
            console.log(`    Saldo: ${info.saldo}`);
            console.log(`    HE: ${info.he}`);
            console.log(`    Noturno: ${info.noturno}`);
            console.log(`    Atraso: ${info.atraso}`);
            console.log(`    H1: ${info.h1}`);
            console.log(`    H2: ${info.h2}`);
        }
    }

}

function enviarJson() {
    criarJson();
    //transformar em json e guardar em um arquivo 

}