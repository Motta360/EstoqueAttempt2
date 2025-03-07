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