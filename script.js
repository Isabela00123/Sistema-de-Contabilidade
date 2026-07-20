// ================================
// BANCO DE DADOS (LocalStorage)
// ================================

let lancamentos =
    JSON.parse(localStorage.getItem("lancamentos")) || [];


// ================================
// ELEMENTOS HTML
// ================================

const form = document.getElementById("formLancamento");

const tabela = document.getElementById("tabelaLancamentos");

const feedback = document.getElementById("feedback");

const totalLancamentos =
    document.getElementById("totalLancamentos");

const totalDebito =
    document.getElementById("totalDebito");

const totalCredito =
    document.getElementById("totalCredito");


// ================================
// EVENTOS
// ================================

form.addEventListener("submit", salvarLancamento);


// ================================
// INICIALIZAÇÃO
// ================================

renderizarTabela();

atualizarDashboard();

atualizarCards();


// ================================
// SALVAR LANÇAMENTO
// ================================

function salvarLancamento(event) {

    event.preventDefault();

    const contaDebito =
        document.getElementById("contaDebito").value;

    const contaCredito =
        document.getElementById("contaCredito").value;

    const valorDebito =
        Number(document.getElementById("valorDebito").value);

    const valorCredito =
        Number(document.getElementById("valorCredito").value);


    if (

        valorDebito <= 0 ||

        valorCredito <= 0

    ) {

        mostrarMensagem(

            "Informe valores maiores que zero.",

            "erro"

        );

        return;

    }


    if (valorDebito !== valorCredito) {

        mostrarMensagem(

            "Débito e Crédito precisam possuir exatamente o mesmo valor.",

            "erro"

        );

        return;

    }


    const lancamento = {

        id: Date.now(),

        data: new Date().toLocaleDateString("pt-BR"),

        contaDebito,

        contaCredito,

        valor: valorDebito

    };


    lancamentos.push(lancamento);

    salvarLocal();

    renderizarTabela();

    atualizarCards();

    limparFormulario();

    mostrarMensagem(

        "Lançamento salvo com sucesso.",

        "sucesso"

    );

}


// ================================
// TABELA
// ================================

function renderizarTabela() {

    tabela.innerHTML = "";

    lancamentos.forEach((item) => {

        tabela.innerHTML += `

            <tr>

                <td>${item.data}</td>

                <td>${item.contaDebito}</td>

                <td>${item.contaCredito}</td>

                <td>

                    ${formatarMoeda(item.valor)}

                </td>

                <td>

                    <button

                        class="btn-delete"

                        onclick="excluirLancamento(${item.id})"

                    >

                        Excluir

                    </button>

                </td>

            </tr>

        `;

    });

}


// ================================
// EXCLUIR
// ================================

function excluirLancamento(id) {

    if (!confirm("Deseja realmente excluir este lançamento?")) {

        return;

    }

    lancamentos = lancamentos.filter(

        item => item.id !== id

    );

    salvarLocal();

    renderizarTabela();

    atualizarCards();

}


// ================================
// CARDS SUPERIORES
// ================================

function atualizarCards() {

    totalLancamentos.textContent =

        lancamentos.length;

    let soma = 0;

    lancamentos.forEach(item => {

        soma += item.valor;

    });

    totalDebito.textContent =

        formatarMoeda(soma);

    totalCredito.textContent =

        formatarMoeda(soma);

}


// ================================
// LOCAL STORAGE
// ================================

function salvarLocal() {

    localStorage.setItem(

        "lancamentos",

        JSON.stringify(lancamentos)

    );

}


// ================================
// LIMPAR FORMULÁRIO
// ================================

function limparFormulario() {

    form.reset();

}


// ================================
// MENSAGENS
// ================================

function mostrarMensagem(texto, tipo) {

    feedback.textContent = texto;

    if (tipo === "sucesso") {

        feedback.style.color = "#4F8A10";

    }

    else {

        feedback.style.color = "#C0392B";

    }

    setTimeout(() => {

        feedback.textContent = "";

    }, 3000);

}

// ================================
// NAVEGAÇÃO DA SIDEBAR
// ================================

const links = document.querySelectorAll(".sidebar a");

const paginas = document.querySelectorAll(".page");

document
    .getElementById("lancamentos")
    .classList.add("active");

links.forEach(link => {

    link.addEventListener("click", (e) => {

        e.preventDefault();

        links.forEach(item => {

            item.parentElement.classList.remove("active");

        });

        link.parentElement.classList.add("active");

        paginas.forEach(pagina => {

            pagina.classList.remove("active");

        });

        const destino =

            link.dataset.section;

        document
            .getElementById(destino)
            .classList.add("active");

    });

});




// ================================
// UTILITÁRIOS
// ================================

function formatarMoeda(valor) {

    return valor.toLocaleString(

        "pt-BR",

        {

            style: "currency",

            currency: "BRL"

        }

    );

}

// =======================================
// MÓDULO 2 - CÁLCULO DE IMPOSTOS
// =======================================

const btnCalcular = document.getElementById("btnCalcular");

btnCalcular.addEventListener("click", calcularImpostos);

function calcularImpostos() {

    const valorBase = Number(document.getElementById("valorBase").value);

    const imposto1 = Number(document.getElementById("imposto1").value);

    const imposto2 = Number(document.getElementById("imposto2").value);

    const imposto3 = Number(document.getElementById("imposto3").value);

    if (
        valorBase <= 0 ||
        imposto1 < 0 ||
        imposto2 < 0 ||
        imposto3 < 0
    ) {

        alert("Preencha todos os valores corretamente.");

        return;

    }

    let valor = valorBase;

    let passos = "";

    // PRIMEIRO IMPOSTO

    let anterior = valor;

    valor *= (1 + imposto1 / 100);

    passos += `
        ${formatarMoeda(anterior)}
        ×
        ${(1 + imposto1 / 100).toFixed(2)}
        =
        <strong>${formatarMoeda(valor)}</strong>
        <br><br>
    `;

    // SEGUNDO IMPOSTO

    anterior = valor;

    valor *= (1 + imposto2 / 100);

    passos += `
        ${formatarMoeda(anterior)}
        ×
        ${(1 + imposto2 / 100).toFixed(2)}
        =
        <strong>${formatarMoeda(valor)}</strong>
        <br><br>
    `;

    // TERCEIRO IMPOSTO

    anterior = valor;

    valor *= (1 + imposto3 / 100);

    passos += `
        ${formatarMoeda(anterior)}
        ×
        ${(1 + imposto3 / 100).toFixed(2)}
        =
        <strong>${formatarMoeda(valor)}</strong>
    `;

    document.getElementById("resultadoFinal").textContent =
        formatarMoeda(valor);

    document.getElementById("passosCalculo").innerHTML =
        passos;

}

// =======================================
// MÓDULO 3 - DEPRECIAÇÃO LINEAR
// =======================================

let ativos =
    JSON.parse(localStorage.getItem("ativos")) || [];

const formAtivo =
    document.getElementById("formAtivo");

const tabelaAtivos =
    document.getElementById("tabelaAtivos");

formAtivo.addEventListener("submit", cadastrarAtivo);

renderizarAtivos();

atualizarDashboard();

function cadastrarAtivo(e) {

    e.preventDefault();

    const nome =
        document.getElementById("nomeAtivo").value;

    const valor =
        Number(document.getElementById("valorAtivo").value);

    const dataCompra =
        document.getElementById("dataCompra").value;

    const vidaUtil =
        Number(document.getElementById("vidaUtil").value);

    if (
        nome === "" ||
        valor <= 0 ||
        vidaUtil <= 0 ||
        dataCompra === ""
    ) {

        alert("Preencha todos os campos.");

        return;

    }

    const resultado =
        calcularDepreciacao(
            valor,
            dataCompra,
            vidaUtil
        );

    document.getElementById("valorResidual").textContent =
        formatarMoeda(resultado.valorResidual);

    document.getElementById("depreciacaoAcumulada").textContent =
        formatarMoeda(resultado.depreciacao);

    document.getElementById("valorAtual").textContent =
        formatarMoeda(resultado.valorAtual);

    ativos.push({

        nome,

        valor,

        dataCompra,

        vidaUtil,

        valorAtual: resultado.valorAtual

    });

    salvarAtivos();

    renderizarAtivos();

    formAtivo.reset();

}

function calcularDepreciacao(valor, dataCompra, vidaUtil) {

    const hoje = new Date();

    const compra = new Date(dataCompra);

    let meses =

        (hoje.getFullYear() - compra.getFullYear()) * 12 +

        (hoje.getMonth() - compra.getMonth());

    if (meses < 0) {

        meses = 0;

    }

    const valorResidual =

        valor * 0.10;

    const valorDepreciavel =

        valor - valorResidual;

    const depreciacaoMensal =

        valorDepreciavel /

        (vidaUtil * 12);

    let depreciacao =

        depreciacaoMensal * meses;

    if (depreciacao > valorDepreciavel) {

        depreciacao = valorDepreciavel;

    }

    let valorAtual =

        valor - depreciacao;

    if (valorAtual < valorResidual) {

        valorAtual = valorResidual;

    }

    return {

        valorResidual,

        depreciacao,

        valorAtual

    };

}

function renderizarAtivos() {

    tabelaAtivos.innerHTML = "";

    ativos.forEach(item => {

        tabelaAtivos.innerHTML += `

            <tr>

                <td>${item.nome}</td>

                <td>${formatarMoeda(item.valor)}</td>

                <td>${item.dataCompra}</td>

                <td>${item.vidaUtil} anos</td>

                <td>${formatarMoeda(item.valorAtual)}</td>

            </tr>

        `;

    });

}

function salvarAtivos() {

    localStorage.setItem(

        "ativos",

        JSON.stringify(ativos)

    );

}

// =======================================
// MÓDULO 4 - DASHBOARD
// =======================================

atualizarDashboard();

function atualizarDashboard() {

    // Lê os dados salvos
    const lancamentos =
        JSON.parse(localStorage.getItem("lancamentos")) || [];

    const ativos =
        JSON.parse(localStorage.getItem("ativos")) || [];

    // Total de lançamentos
    const totalLancamentos = lancamentos.length;

    // Total de ativos
    const totalAtivos = ativos.length;

    // Soma do valor atual dos ativos
    let valorAtivos = 0;

    ativos.forEach(ativo => {

        valorAtivos += Number(ativo.valorAtual);

    });

    // Soma dos débitos
    let totalDebitos = 0;

    lancamentos.forEach(item => {

        totalDebitos += Number(item.valor);

    });

    // Atualiza os cards

    document.getElementById("dashLancamentos").textContent =
        totalLancamentos;

    document.getElementById("dashAtivos").textContent =
        totalAtivos;

    document.getElementById("dashValorAtivos").textContent =
        formatarMoeda(valorAtivos);

    // Atualiza as barras

    document
        .getElementById("barLancamentos")
        .setAttribute("width", totalLancamentos * 30);

    document
        .getElementById("barAtivos")
        .setAttribute("width", totalAtivos * 40);

    document
        .getElementById("barValor")
        .setAttribute("width", valorAtivos / 50);

    document
        .getElementById("barDebitos")
        .setAttribute("width", totalDebitos / 20);

}