const instanciasGraficos = {};

// Inicialização dos Gráficos
function inicializar() {
    gerarGrafico('chartAlimentos', 'Alimentos', 25, '#e74c3c');
    gerarGrafico('chartVestimentas', 'Vestimentas', 55, '#f1c40f');
    gerarGrafico('chartHigiene', 'Higiene Pessoal', 80, '#2ecc71');
}

function gerarGrafico(id, label, valor, cor) {
    const ctx = document.getElementById(id).getContext('2d');
    instanciasGraficos[id] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [label],
            datasets: [{
                data: [valor],
                backgroundColor: cor,
                borderRadius: 8,
                barThickness: 35
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { beginAtZero: true, max: 100 } },
            plugins: { legend: { display: false } }
        }
    });
}

function atualizarSistema() {
    const tipo = document.getElementById('tipo').value;
    const categoriaId = document.getElementById('categoria').value;
    const categoriaTxt = document.getElementById('categoria').options[document.getElementById('categoria').selectedIndex].text;
    const inputQtd = document.getElementById('quantidade');
    const qtd = parseInt(inputQtd.value);

    if (!qtd || qtd <= 0) {
        alert("Insira uma quantidade válida.");
        return;
    }

    const chart = instanciasGraficos[categoriaId];
    let valorAtual = chart.data.datasets[0].data[0];
    
    // Lógica de cálculo
    let novoValor = tipo === 'entrada' ? valorAtual + qtd : valorAtual - qtd;
    novoValor = Math.max(0, Math.min(100, novoValor));

    // Atualização Visual do Gráfico
    chart.data.datasets[0].data[0] = novoValor;
    if (novoValor < 30) chart.data.datasets[0].backgroundColor = '#e74c3c';
    else if (novoValor < 60) chart.data.datasets[0].backgroundColor = '#f1c40f';
    else chart.data.datasets[0].backgroundColor = '#2ecc71';
    chart.update();

    // Histórico e Logs
    const dataHora = new Date().toLocaleString('pt-BR');
    document.getElementById('data-' + categoriaId).innerHTML = `Última atualização: ${dataHora}`;
    
    registrarLog(dataHora, tipo, categoriaTxt, qtd);
    inputQtd.value = "";
}

function registrarLog(data, tipo, item, qtd) {
    const tabela = document.getElementById('tabelaLogs').getElementsByTagName('tbody')[0];
    const linha = tabela.insertRow(0);
    const cor = tipo === 'entrada' ? '#27ae60' : '#c0392b';
    
    linha.innerHTML = `
        <td>${data}</td>
        <td style="color:${cor}; font-weight:bold;">${tipo.toUpperCase()}</td>
        <td>${item}</td>
        <td>${qtd} un.</td>
    `;
}

function filtrarTabela() {
    const termo = document.getElementById("inputBusca").value.toLowerCase();
    const linhas = document.querySelectorAll("#tabelaLogs tbody tr");
    linhas.forEach(linha => {
        linha.style.display = linha.innerText.toLowerCase().includes(termo) ? "" : "none";
    });
}

// Rodar ao carregar a página
window.onload = inicializar;