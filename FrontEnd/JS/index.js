// Função para adicionar itens à lista, organizados por categoria
function AdicionarLista(dados) {
    const ul = document.getElementById("lista-itens");
    ul.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

    // Agrupa os itens por categoria
    const itensPorCategoria = {};
    dados.forEach(element => {
        if (!itensPorCategoria[element.categoria]) {
            itensPorCategoria[element.categoria] = [];
        }
        itensPorCategoria[element.categoria].push(element);
    });

    // Ordena as categorias alfabeticamente
    const categoriasOrdenadas = Object.keys(itensPorCategoria).sort();

    // Itera sobre as categorias e cria seções para cada uma
    categoriasOrdenadas.forEach(categoria => {
        // Cria um contêiner para a categoria
        const secaoCategoria = document.createElement('div');
        secaoCategoria.id = categoria.toLowerCase().replace(/ /g, '-'); // Define o ID da seção
        secaoCategoria.classList.add("secao-categoria");

        // Cria um título para a categoria
        const tituloCategoria = document.createElement('h2');
        tituloCategoria.textContent = categoria;
        tituloCategoria.classList.add("categoria-titulo");
        secaoCategoria.appendChild(tituloCategoria);

        // Cria uma lista para os itens da categoria
        const listaItens = document.createElement('ul');
        listaItens.classList.add("lista-itens-categoria");

        // Adiciona os itens da categoria
        itensPorCategoria[categoria].forEach(element => {
            const li = document.createElement('li');
            li.textContent = element.name;
            li.classList.add("item");

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

            // Adiciona o li à lista de itens da categoria
            listaItens.appendChild(li);
        });

        // Adiciona a lista de itens à seção da categoria
        secaoCategoria.appendChild(listaItens);

        // Adiciona a seção da categoria à lista principal
        ul.appendChild(secaoCategoria);
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
    const GestorSTD = document.getElementById("GestorSTD").value;
    const GestorR = document.getElementById("GestorR").value;
    const Fornecedor = document.getElementById("Fornecedor").value;
    const DataPrevista = document.getElementById("DataPrevista").value;
    const email = document.getElementById("email").value;
    const Entrada = document.getElementById("I/O").value;
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
            pedido: JSON.stringify(itensSelecionados),
            data: new Date().toISOString(),
            gestorSTD: GestorSTD, // Note o camelCase
            gestorResponsavel: GestorR, // Note o camelCase
            fornecedor: Fornecedor, // Note o camelCase
            dataPrevista: DataPrevista, // Note o camelCase
            email: email,
            entrada: Entrada // Note o camelCase
        };
        console.log('Dados do pedido:', pedido);

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