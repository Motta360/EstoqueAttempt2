function Post() {
    const nome = document.getElementById('Nome').value;
    const quantidade = document.getElementById('Quantidade').value;
    const categoria = document.getElementById('Categoria').value;

    const movel = {
        name: nome,
        quantidade: parseInt(quantidade),
        categoria: categoria
    };

    fetch('http://localhost:8080/1/moveis/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
        },
        body: JSON.stringify(movel) // Converte o objeto para JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.status);
            }
            return response.json(); // Converte a resposta para JSON
        })
        .then(data => {
            console.log('Móvel registrado com sucesso:', data);
            alert('Móvel registrado com sucesso!'); // Exibe um alerta de sucesso
            document.getElementById('registrarForm').reset(); // Limpa o formulário
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao registrar móvel: ' + error.message); // Exibe um alerta de erro
        });
}