document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o envio padrão do form

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // usuario e senha de teste
    const usuarioCorreto = 'admin';
    const senhaCorreta = '1234';

    if (username === usuarioCorreto && password === senhaCorreta){
        window.location.href = "../sistema-de-horas/index.html" 
    } else {
        document.getElementById('erro').innerText = "Usuário ou senha incorretos!"
    }
})