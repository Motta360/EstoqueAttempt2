        // Função para adicionar itens à lista
        function AdicionarLista(dados) {
            const ul = document.getElementById("lista-itens");
            ul.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

            dados.forEach(element => {
                const li = document.createElement('li');
                li.textContent = element.name;
                li.classList.add("item")

                // Cria o checkbox
                const buttonCheck = document.createElement('input');
                buttonCheck.type = "checkbox";
                buttonCheck.classList.add("checkbox");

                // Cria o input de texto
                const inputText = document.createElement('input');
                inputText.type = "text";
                inputText.placeholder = "Quantidade";
                inputText.classList.add("input-text");
                inputText.style.display = "none"; // Inicialmente oculto

                // Adiciona um evento ao checkbox para mostrar/ocultar o input de texto
                buttonCheck.addEventListener('change', function () {
                    if (this.checked) {
                        inputText.style.display = "inline-block"; // Mostra o input
                    } else {
                        inputText.style.display = "none"; // Oculta o input
                    }
                });

                // Adiciona o checkbox e o input ao li
                li.appendChild(buttonCheck);
                li.appendChild(inputText);

                // Adiciona o li à lista
                ul.appendChild(li);
            });
        }

        // Função para buscar os móveis da API
        function GET() {
            fetch('http://localhost:8080/1/moveis')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro na requisição: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    AdicionarLista(data); // Chama a função para adicionar os itens à lista
                })
                .catch(error => {
                    console.error('Erro:', error);
                });
        }

        // Chama a função GET após o carregamento da página
        document.addEventListener('DOMContentLoaded', function () {
            GET();
        });

        function enviarPedido() {
            const itensSelecionados = [];
            const checkboxes = document.querySelectorAll('.checkbox:checked'); // Seleciona todos os checkboxes marcados
            const agencia1 = document.getElementById("Agencia").value;
            checkboxes.forEach(checkbox => {
                const li = checkbox.parentElement; // Obtém o <li> que contém o checkbox e o input
                const nomeItem = li.textContent.trim().split("Quantidade")[0]; // Obtém o nome do item
                const quantidade = li.querySelector('.input-text').value; // Obtém a quantidade
        
                if (quantidade && !isNaN(quantidade)) { // Verifica se a quantidade é válida
                    itensSelecionados.push({
                        name: nomeItem,
                        quantidade: parseInt(quantidade)
                    });
                }
            });
        
            if (itensSelecionados.length > 0) {
                // Cria o objeto de pedido
                const pedido = {
                    agencia: agencia1,
                    pedido: JSON.stringify(itensSelecionados), // Converte a lista de itens para uma string JSON
                    data: new Date().toISOString() // Adiciona a data atual
                };
        
                // Envia o pedido para a API
                fetch('http://localhost:8080/pedidos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pedido)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao enviar pedido: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    alert('Pedido enviado com sucesso!');
                    console.log('Resposta da API:', data);
                })
                .catch(error => {
                    console.error('Erro:', error);
                    alert('Erro ao enviar pedido. Verifique o console para mais detalhes.');
                });
            } else {
                alert('Nenhum item selecionado ou quantidade inválida.');
            }
        }
        
        // Adiciona um evento de clique ao botão "Pedir"
        document.getElementById('btnPedir').addEventListener('click', enviarPedido);