// VARIÁVEIS GLOBAIS
const KEY_DB = 'hydroTrackDB';
const META_DIARIA = 2500;
let editandoId = null;

// --- CRUD: READ (Ler dados) ---
function lerDados() {
    const dados = localStorage.getItem(KEY_DB);
    return dados ? JSON.parse(dados) : [];
}

// --- CRUD: CREATE & SAVE (Salvar dados) ---
function salvarDados(dados) {
    localStorage.setItem(KEY_DB, JSON.stringify(dados));
}

// FUNÇÃO PRINCIPAL: Adicionar Água
function adicionarAgua(qtd) {
    const dados = lerDados();
    
    const novoRegistro = {
        id: Date.now(), // ID único baseado no tempo
        ml: parseInt(qtd),
        data: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    dados.unshift(novoRegistro); // Adiciona no começo da lista
    salvarDados(dados);
    renderizar();
}

// --- CRUD: UPDATE (Atualizar registro) ---
function salvarPersonalizado() {
    const qtdInput = document.getElementById('inputQtd').value;
    
    if (!qtdInput || qtdInput <= 0) return alert("Digite um valor válido!");

    let dados = lerDados();

    if (editandoId) {
        // Modo Edição: Acha o index e atualiza
        const index = dados.findIndex(item => item.id === editandoId);
        if (index !== -1) {
            dados[index].ml = parseInt(qtdInput);
        }
        editandoId = null; // Reseta modo edição
    } else {
        // Modo Criação Manual
        adicionarAgua(qtdInput);
        fecharModal();
        return; // adicionarAgua já renderiza e salva
    }

    salvarDados(dados);
    renderizar();
    fecharModal();
}

// --- CRUD: DELETE (Remover registro) ---
function deletar(id) {
    if(confirm("Remover este registro?")) {
        let dados = lerDados();
        dados = dados.filter(item => item.id !== id);
        salvarDados(dados);
        renderizar();
    }
}

// PREPARAR EDIÇÃO
function prepararEdicao(id) {
    const dados = lerDados();
    const item = dados.find(d => d.id === id);
    
    if (item) {
        editandoId = id;
        document.getElementById('modalTitulo').innerText = "Editar Quantidade";
        document.getElementById('inputQtd').value = item.ml;
        document.getElementById('modalEditor').classList.remove('hidden');
    }
}

// --- HTML DINÂMICO & VISUAL ---
function renderizar() {
    const dados = lerDados();
    const lista = document.getElementById('listaHistorico');
    const totalDisplay = document.getElementById('totalDisplay');
    const circulo = document.querySelector('.progress-circle');

    lista.innerHTML = '';
    let totalConsumido = 0;

    // Constrói o HTML da lista
    dados.forEach(item => {
        totalConsumido += item.ml;

        const div = document.createElement('div');
        div.classList.add('log-item');
        div.innerHTML = `
            <div class="log-info">
                <strong>${item.ml}ml</strong>
                <span>🕒 ${item.data}</span>
            </div>
            <div class="actions">
                <button onclick="prepararEdicao(${item.id})">✏️</button>
                <button onclick="deletar(${item.id})" style="color:red">🗑️</button>
            </div>
        `;
        lista.appendChild(div);
    });

    // Atualiza o Display Total
    totalDisplay.innerText = totalConsumido;

    // Atualiza o Gráfico Circular (CSS Conic Gradient)
    const porcentagem = Math.min((totalConsumido / META_DIARIA) * 100, 100);
    circulo.style.background = `conic-gradient(#00bcd4 ${porcentagem}%, #ddd ${porcentagem}%)`;
}

// MODAIS
function abrirModalPersonalizado() {
    editandoId = null;
    document.getElementById('modalTitulo').innerText = "Adicionar Manualmente";
    document.getElementById('inputQtd').value = '';
    document.getElementById('modalEditor').classList.remove('hidden');
}

function fecharModal() {
    document.getElementById('modalEditor').classList.add('hidden');
}

// Inicializar
document.addEventListener('DOMContentLoaded', renderizar);