// Função para buscar os detalhes do pedido
function carregarDetalhesPedido() {
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('id'); // Obtém o ID do pedido da URL

    if (!pedidoId) {
        alert('ID do pedido não encontrado na URL.');
        return;
    }

    // Faz a requisição para a API
    fetch(`http://localhost:8080/pedidos/${pedidoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar detalhes do pedido: ' + response.status);
            }
            return response.json();
        })
        .then(pedido => {
            // Exibe os detalhes do pedido na página
            document.getElementById('pedido-id').textContent = `Detalhes do Pedido #${pedido.id}`;
            const detalhesDiv = document.getElementById('pedido-detalhes');

            // Cria elementos para exibir os detalhes
            const data = document.createElement('p');
            data.textContent = `Data: ${new Intl.DateTimeFormat('pt-BR').format(new Date(pedido.data))}`;

            const agencia = document.createElement('p');
            agencia.textContent = `Agência: ${pedido.agencia}`;

            const gestorSTD = document.createElement('p');
            gestorSTD.textContent = `Gestor STD: ${pedido.gestorSTD}`; // Correto (camelCase)

            const gestorResponsavel = document.createElement('p');
            gestorResponsavel.textContent = `Gestor Responsável: ${pedido.gestorResponsavel}`; // Correto (camelCase)

            const fornecedor = document.createElement('p');
            fornecedor.textContent = `Fornecedor: ${pedido.fornecedor}`; // Correto (camelCase)

            const dataPrevista = document.createElement('p');
            dataPrevista.textContent = `Data Prevista: ${pedido.dataPrevista}`; // Correto (camelCase)

            const email = document.createElement('p');
            email.textContent = `Email: ${pedido.email || 'Não informado'}`; // Exibe "Não informado" se o campo estiver ausente

            const entrada = document.createElement('p');
            entrada.textContent = `Movimento: ${pedido.entrada}`; // Correto (camelCase)

            // Parseia a string JSON dos itens
            const itens = JSON.parse(pedido.pedido);

            // Cria uma lista para exibir os itens
            const listaItens = document.createElement('ul');
            itens.forEach(item => {
                const itemLi = document.createElement('li');
                itemLi.textContent = `${item.name}: ${item.quantidade}`; // Usando "name" em vez de "nome"
                listaItens.appendChild(itemLi);
            });

            // Adiciona os detalhes à página
            detalhesDiv.appendChild(data);
            detalhesDiv.appendChild(agencia);
            detalhesDiv.appendChild(gestorSTD);
            detalhesDiv.appendChild(gestorResponsavel);
            detalhesDiv.appendChild(fornecedor);
            detalhesDiv.appendChild(dataPrevista);
            detalhesDiv.appendChild(email);
            detalhesDiv.appendChild(entrada);
            detalhesDiv.appendChild(listaItens);

            // Verifica se o pedido já foi executado
            if (pedido.executado) {
                // Desabilita o botão "Executar Pedido"
                const botaoExecutar = document.getElementById('executarPedido');
                botaoExecutar.disabled = true;
                botaoExecutar.textContent = 'Pedido Executado';

                // Exibe uma mensagem informando que o pedido já foi executado
                const mensagem = document.createElement('p');
                mensagem.textContent = 'Este pedido já foi executado.';
                mensagem.style.color = 'green'; // Cor verde para indicar sucesso
                mensagem.style.fontWeight = 'bold';
                detalhesDiv.appendChild(mensagem);
            } else {
                // Adiciona o evento de clique ao botão "Executar Pedido"
                document.getElementById('executarPedido').addEventListener('click', () => {
                    executarPedido(pedidoId, itens);
                });
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar detalhes do pedido. Verifique o console para mais detalhes.');
        });
}

// Função para executar o pedido
function executarPedido(pedidoId, itens) {
    console.log('Enviando requisição para:', `http://localhost:8080/pedidos/${pedidoId}/executar`);
    console.log('Corpo da requisição:', JSON.stringify(itens));

    fetch(`http://localhost:8080/pedidos/${pedidoId}/executar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itens)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Erro ao executar pedido');
            });
        }
        return response.json();
    })
    .then(data => {
        alert(data.message); // Exibe a mensagem de sucesso
        console.log('Resposta da API:', data);
        // Recarrega a página para atualizar o status do pedido
        window.location.reload();
    })
    .catch(error => {
        console.error('Erro:', error);
        alert(error.message); // Exibe a mensagem de erro
    });
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarDetalhesPedido);