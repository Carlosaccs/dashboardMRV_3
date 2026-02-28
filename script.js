/* --- CONFIGURAÇÕES --- */
const LINK_PLANILHA = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTqmzCyl1ScBsPr6d4wtq3tADya58_T9DVkhcUSDgmbwNwyZoc4tPrOMUrt8kB7UJH6tiHr_KVxfS2W/pub?output=csv";
let dadosGerais = [];
let pathSelecionado = null;

const DICIONARIO_NOMES = {
    "adamantina": "Adamantina", "americana": "Americana", "aracatuba": "Araçatuba", "araraquara": "Araraquara", 
    "aruja": "Arujá", "barueri": "Barueri", "bauru": "Bauru", "birigui": "Birigui", "caieiras": "Caieiras", 
    "cajamar": "Cajamar", "campinas": "Campinas", "carapicuiba": "Carapicuíba", "cotia": "Cotia", 
    "diadema": "Diadema", "embudasartes": "Embu das Artes", "ferrazdevasconcelos": "Ferraz de Vasconcelos", 
    "franca": "Franca", "franciscomorato": "Francisco Morato", "francodarocha": "Franco da Rocha", 
    "guarulhos": "Guarulhos", "itapevi": "Itapevi", "itaquaquecetuba": "Itaquaquecetuba", "itapetininga": "Itapetininga",
    "itu": "Itu", "jundiai": "Jundiaí", "limeira": "Limeira", "marilia": "Marília", "maua": "Mauá", 
    "mogidascruzes": "Mogi das Cruzes", "osasco": "Osasco", "piracicaba": "Piracicaba", "poa": "Poá", 
    "presidenteprudente": "Presidente Prudente", "ribeiraopires": "Ribeirão Pires", "ribeiraopreto": "Ribeirão Preto", 
    "santana": "Santana", "santanadeparnaiba": "Santana de Parnaíba", "santoandre": "Santo André", 
    "saobernardo": "São Bernardo do Campo", "saocaetano": "São Caetano do Sul", "saojosedoriopreto": "São José do Rio Preto", 
    "saojosedoscampos": "São José dos Campos", "sorocaba": "Sorocaba", "sumare": "Sumaré", "suzano": "Suzano", 
    "taboaodaserra": "Taboão da Serra", "taubate": "Taubaté", "vargemgrande": "Vargem Grande Paulista"
    // Adicione mais cidades conforme sua necessidade
};

/* --- FUNÇÕES DE DADOS --- */
async function carregarDados() {
    try {
        const resposta = await fetch(LINK_PLANILHA + "&cb=" + new Date().getTime());
        const texto = await resposta.text();
        const linhas = texto.split(/\r?\n/).filter(l => l.trim() !== "");
        const sep = linhas[0].includes(';') ? ';' : ',';
        
        dadosGerais = linhas.slice(1).map(linha => {
            const col = parseCSVLine(linha, sep);
            const get = (idx) => col[idx] ? col[idx].replace(/^["']|["']$/g, '').trim() : '';
            return {
                id: get(0).toLowerCase().replace(/[\s-_]/g, ''),
                nome: get(2), 
                estoque: parseInt(get(3)) || 0,
                endereco: get(4) + (get(5) ? ", " + get(5) : ""),
                valor: get(8), 
                previsao: get(7),
                plantas: `de ${get(9)} até ${get(10)}`,
                obra: get(11),
                dica: get(17), 
                obs: get(18),
                bookCliente: formatarLinkSeguro(get(19)),
                bookCorretor: formatarLinkSeguro(get(20)),
                video1: formatarLinkSeguro(get(21)),
                localizacaoLink: formatarLinkSeguro(get(28))
            };
        }).filter(item => item.id !== "");
        
        atualizarListaLateral(); // Chama a função para criar a lista na esquerda
    } catch (e) { console.error("Erro CSV:", e); }
}

function parseCSVLine(line, sep) {
    const result = []; let cur = ''; let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === sep && !inQuotes) { result.push(cur.trim()); cur = ''; }
        else cur += char;
    }
    result.push(cur.trim()); return result;
}

function formatarLinkSeguro(url) {
    if (!url || url === "-") return "";
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
}

/* --- INTERFACE --- */
function atualizarListaLateral() {
    const listaBox = document.getElementById("lista-cidades-scroll");
    if (!listaBox) return;
    
    // Pega IDs únicos que têm MRV
    const idsUnicos = [...new Set(dadosGerais.map(d => d.id))].sort();
    
    listaBox.innerHTML = "";
    idsUnicos.forEach(id => {
        const nome = DICIONARIO_NOMES[id] || id.toUpperCase();
        const btn = document.createElement("button");
        btn.className = "btRes"; // Reutiliza estilo de botão
        btn.style.fontSize = "12px";
        btn.textContent = nome;
        btn.onclick = () => {
            // Simula o clique no path do mapa
            const path = document.getElementById(id);
            if (path) path.dispatchEvent(new Event('click'));
            else gerarBotoes(id); // Se não achar o path, gera os botões direto
        };
        listaBox.appendChild(btn);
    });
}

function resetInterface() {
    document.getElementById("btRes-container").innerHTML = "";
    document.getElementById("titulo-dinamico").textContent = "";
    document.getElementById("residencial-info").style.display = "none";
    document.getElementById("dica-corretor-box").style.display = "none";
    document.getElementById("obs-box").style.display = "none";
}

function gerarBotoes(idPath) {
    resetInterface();
    const container = document.getElementById("btRes-container");
    const titulo = document.getElementById("titulo-dinamico");
    const idBusca = idPath.toLowerCase().replace(/[\s-_]/g, '');
    
    titulo.textContent = "MRV em " + (DICIONARIO_NOMES[idBusca] || idPath.toUpperCase());
    const filtrados = dadosGerais.filter(d => d.id === idBusca);
    
    if(filtrados.length === 0) {
        container.innerHTML = "<p style='color:#999; font-style:italic;'>Nenhum residencial cadastrado.</p>";
        return;
    }

    filtrados.forEach(res => {
        const btn = document.createElement("button");
        btn.className = "btRes";
        btn.innerHTML = `<strong>${res.nome}</strong>`;
        btn.onclick = () => {
            document.querySelectorAll(".btRes").forEach(b => b.classList.remove("btRes-ativo"));
            btn.classList.add("btRes-ativo");
            abrirFicha(res);
        };
        container.appendChild(btn);
    });
}

function abrirFicha(res) {
    const infoBox = document.getElementById("residencial-info");
    const dicaBox = document.getElementById("dica-corretor-box");
    const obsBox = document.getElementById("obs-box");
    
    infoBox.style.display = "block";
    dicaBox.style.display = res.dica ? "block" : "none";
    dicaBox.innerHTML = `💡 <strong>Dica:</strong> ${res.dica}`;
    obsBox.style.display = res.obs ? "block" : "none";
    obsBox.innerHTML = `⚠️ <strong>Obs:</strong> ${res.obs}`;

    let botoesHTML = "";
    if (res.bookCliente) botoesHTML += `<button onclick="copiarLink('${res.bookCliente}', this, '📄 Copiar Book Cliente')" class="btn-acao btn-book">📄 Copiar Book Cliente</button>`;
    if (res.video1) botoesHTML += `<button onclick="copiarLink('${res.video1}', this, '🎥 Copiar Vídeo')" class="btn-acao">🎥 Copiar Vídeo</button>`;
    if (res.localizacaoLink) botoesHTML += `<button onclick="copiarLink('${res.localizacaoLink}', this, '📍 Copiar Localização')" class="btn-acao">📍 Copiar Localização</button>`;

    infoBox.innerHTML = `
        <h3 style="color:rgb(6,94,3); margin-bottom:10px;">${res.nome}</h3>
        <div class="grid-tecnico">
            <div><span class="label">💰 Preço:</span><br>${res.valor}</div>
            <div><span class="label">🔑 Entrega:</span><br>${res.previsao}</div>
            <div><span class="label">🏗️ Obra:</span><br>${res.obra}%</div>
        </div>
        <div style="margin-top:20px;">${botoesHTML}</div>`;
}

async function copiarLink(url, btnElement, textoOriginal) {
    try {
        await navigator.clipboard.writeText(url);
        btnElement.textContent = "✅ Link Copiado!";
        btnElement.style.background = "#000";
        setTimeout(() => { 
            btnElement.textContent = textoOriginal; 
            btnElement.style.background = textoOriginal.includes("Book") ? "rgb(6,94,3)" : "rgb(255, 153, 0)"; 
        }, 2000);
    } catch (err) { alert("Erro ao copiar."); }
}

function configurarEventos() {
    const display = document.getElementById("nome-regiao");
    document.querySelectorAll("path").forEach(p => {
        p.onclick = (e) => {
            if (p.closest(".caixa-minimizada")) return;
            const idNormalizado = p.id.toLowerCase().replace(/[\s-_]/g, '');
            
            if (idNormalizado === "grandesaopaulo") {
                e.stopPropagation();
                trocarMapas(document.getElementById("container-gsp"));
                return;
            }

            display.textContent = DICIONARIO_NOMES[idNormalizado] || p.id.toUpperCase();

            if (!p.classList.contains("commrv")) {
                if(pathSelecionado) pathSelecionado.classList.remove("ativo");
                pathSelecionado = null;
                resetInterface();
                return;
            }

            e.stopPropagation();
            if (pathSelecionado === p) {
                p.classList.remove("ativo");
                pathSelecionado = null;
                resetInterface();
            } else {
                if (pathSelecionado) pathSelecionado.classList.remove("ativo");
                pathSelecionado = p;
                p.classList.add("ativo");
                gerarBotoes(p.id);
            }
        };
    });
}

function trocarMapas(el) {
    if (!el.classList.contains("caixa-minimizada")) return;
    const container = document.getElementById("mapa-area-container");
    const atualMax = document.querySelector(".caixa-maximizada");
    el.classList.replace("caixa-minimizada", "caixa-maximizada");
    atualMax.classList.replace("caixa-maximizada", "caixa-minimizada");
    container.insertBefore(el, document.getElementById("nome-regiao").nextSibling);
    pathSelecionado = null;
    document.querySelectorAll("path").forEach(path => path.classList.remove("ativo"));
    resetInterface(); 
}

function toggleModal(show) { document.getElementById("modalSobre").style.display = show ? 'flex' : 'none'; }

window.onload = async () => { 
    await carregarDados(); 
    configurarEventos(); 
};
