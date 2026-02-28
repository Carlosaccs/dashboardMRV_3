/* --- CONFIGURAÇÕES --- */
const LINK_PLANILHA = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTqmzCyl1ScBsPr6d4wtq3tADya58_T9DVkhcUSDgmbwNwyZoc4tPrOMUrt8kB7UJH6tiHr_KVxfS2W/pub?output=csv";

let dadosGerais = [];
let pathSelecionado = null;

const DICIONARIO_NOMES = {
    "adamantina": "Adamantina", "americana": "Americana", "andradina": "Andradina", "anhanguera": "Anhanguera", "apiai": "Apiaí", "aracatuba": "Araçatuba", "araraquara": "Araraquara", "aricanduva": "Aricanduva", "aruja": "Arujá", "assis": "Assis", "avare": "Avaré", "barretos": "Barretos", "barueri": "Barueri", "bauru": "Bauru", "birigui": "Birigui", "biritibamirim": "Biritiba Mirim", "botucatu": "Botucatu", "bragancapaulista": "Bragança Paulista", "butanta": "Butantã", "caieiras": "Caieiras", "cajamar": "Cajamar", "campinas": "Campinas", "campolimpo": "Campo Limpo", "capivari": "Capivari", "caraguatatuba": "Caraguatatuba", "carapicuiba": "Carapicuíba", "casaverde": "Casa Verde", "catanduva": "Catanduva", "cidadeademar": "Cidade Ademar", "cidadetiradentes": "Cidade Tiradentes", "cotia": "Cotia", "diadema": "Diadema", "embudasartes": "Embu das Artes", "embuguacu": "Embu-Guaçu", "ermelinomatarazzo": "Ermelino Matarazzo", "fernandopolis": "Fernandópolis", "ferrazdevasconcelos": "Ferraz de Vasconcelos", "franca": "Franca", "franciscomorato": "Francisco Morato", "francodarocha": "Franco da Rocha", "freguesiadoo": "Freguesia do Ó", "grandesaopaulo": "Grande São Paulo", "guaianases": "Guaianases", "guararema": "Guararema", "guaratinqueta": "Guaratinguetá", "guarulhos": "Guarulhos", "interlagos": "Interlagos", "ipaussu": "Ipaussu", "ipiranga": "Ipiranga", "itaim": "Itaim", "itapecericadaserra": "Itapecerica da Serra", "itapetininga": "Itapetininga", "itapeva": "Itapeva", "itapevi": "Itapevi", "itaquaquecetuba": "Itaquaquecetuba", "itaquera": "Itaquera", "itarare": "Itararé", "itu": "Itu", "jabaquara": "Jabaquara", "jaboticabal": "Jaboticabal", "jacarei": "Jacareí", "jales": "Jales", "jandira": "Jandira", "jau": "Jaú", "josebonifacio": "José Bonifácio", "jundiai": "Jundiaí", "juquitiba": "Juquitiba", "lapa": "Lapa", "limeira": "Limeira", "lins": "Lins", "mairipora": "Mairiporã", "marilia": "Marília", "maua": "Mauá", "mboimirim": "M'Boi Mirim", "miracatu": "Miracatu", "mirantedoparanapanema": "Mirante do Paranapanema", "mogidascruzes": "Mogi das Cruzes", "mogimirim": "Mogi Mirim", "mooca": "Mooca", "osasco": "Osasco", "ourinhos": "Ourinhos", "parelheiros": "Parelheiros", "penapolis": "Penápolis", "penha": "Penha", "pindamonhangaba": "Pindamonhangaba", "pinheiros": "Pinheiros", "piracicaba": "Piracicaba", "piraju": "Piraju", "piraporadobomjesus": "Pirapora do Bom Jesus", "pirassununga": "Pirassununga", "pirituba": "Pirituba", "poa": "Poá", "presidenteprudente": "Presidente Prudente", "registro": "Registro", "ribeiraopires": "Ribeirão Pires", "ribeiraopreto": "Ribeirão Preto", "riograndedaserra": "Rio Grande da Serra", "salesopolis": "Salesópolis", "santaisabel": "Santa Isabel", "santana": "Santana", "santanadeparnaiba": "Santana de Parnaíba", "santoamaro": "Santo Amaro", "santoanastacio": "Santo Anastácio", "santoandre": "Santo André", "santos": "Santos", "saobernardo": "São Bernardo do Campo", "saocaetano": "São Caetano do Sul", "saocarlos": "São Carlos", "saojoaquimdabarra": "São Joaquim da Barra", "saojoaodaboavista": "São João da Boa Vista", "saojosedoriopreto": "São José do Rio Preto", "saojosedoscampos": "São José dos Campos", "saolourenco": "São Lourenço da Serra", "saomateus": "São Mateus", "saomiguel": "São Miguel", "saoroque": "São Roque", "saovicente": "São Vicente", "se": "Sé", "sertaozinho": "Sertãozinho", "sorocaba": "Sorocaba", "sumare": "Sumaré", "suzano": "Suzano", "taboaodaserra": "Taboão da Serra", "taquaritinga": "Taquaritinga", "taubate": "Taubaté", "tremembe": "Tremembé", "tupa": "Tupã", "vargemgrande": "Vargem Grande Paulista", "vilamaria": "Vila Maria", "vilamariana": "Vila Mariana", "vilaprudente": "Vila Prudente", "votorantim": "Votorantim", "votuporanga": "Votuporanga"
};

/* --- FUNÇÕES AUXILIARES --- */

function toggleModal(show) {
    const modal = document.getElementById("modalSobre");
    if (modal) modal.style.display = show ? 'flex' : 'none';
}

function obterNomeFormatado(idPath) {
    if (!idPath) return "Toque em uma região";
    const idLimpo = idPath.toLowerCase().replace(/[\s-_]/g, '').trim();
    return DICIONARIO_NOMES[idLimpo] || idPath.toUpperCase();
}

function formatarLinkSeguro(url) {
    if (!url || typeof url !== 'string' || url.trim() === "" || url === "-") return "";
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
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

function formatarEstoque(qtd) {
    if (qtd === 0) return `<span class="estoque-vendido">VENDIDO</span>`;
    if (qtd <= 5) return `<span class="estoque-alerta">restam ${qtd} unidades</span>`;
    return `<span>restam ${qtd} unidades</span>`;
}

/* --- LÓGICA DE DADOS (MAPEAMENTO ATUALIZADO) --- */

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
                cidade: get(6),
                previsao: get(7), 
                valor: get(8), 
                plantas: `de ${get(9)} até ${get(10)}`,
                obra: get(11), 
                local: get(12), 
                mobilidade: get(13), 
                cultura: get(14), 
                comercio: get(15), 
                saude: get(16),
                dica: get(17), 
                obs: get(18),
                // Novos Canais de Links baseados na sua lista
                bookCliente: formatarLinkSeguro(get(19)),
                bookCorretor: formatarLinkSeguro(get(20)),
                video1: formatarLinkSeguro(get(21)),
                video2: formatarLinkSeguro(get(22)),
                apVaranda: formatarLinkSeguro(get(23)),
                apSemVaranda: formatarLinkSeguro(get(24)),
                apGarden: formatarLinkSeguro(get(25)),
                outroAp: formatarLinkSeguro(get(26)),
                localizacaoLink: formatarLinkSeguro(get(28)), // Coluna 28 Conforme sua lista
                descritivo: formatarLinkSeguro(get(29)),
                // Materiais Diversos (Diversos 1 ao 9 mapeados)
                diversos: [get(30), get(31), get(32), get(33), get(34), get(35), get(36), get(37), get(38)].map(formatarLinkSeguro)
            };
        }).filter(item => item.id !== "");
    } catch (e) { console.error("Erro CSV:", e); }
}

/* --- INTERFACE E EVENTOS --- */

function resetInterface() {
    const container = document.getElementById("btRes-container");
    const titulo = document.getElementById("titulo-dinamico");
    if(container) container.innerHTML = "";
    if(titulo) titulo.textContent = "";
    document.getElementById("residencial-info").style.display = "none";
    document.getElementById("dica-corretor-box").style.display = "none";
    document.getElementById("obs-box").style.display = "none";
}

async function copiarLink(url, elemento, textoOriginal) {
    try {
        // Tenta copiar o texto para a área de transferência
        await navigator.clipboard.writeText(url);
        
        // Aplica o estado visual de "Copiado" usando a classe CSS
        elemento.classList.add('copiado');
        elemento.innerHTML = '✅ Link copiado!';
        
        // Remove o foco do botão para evitar o bug do contorno no Opera
        elemento.blur();

        // Retorna ao estado normal após 2 segundos
        setTimeout(() => {
            elemento.classList.remove('copiado');
            elemento.innerHTML = textoOriginal;
        }, 2000);
        
    } catch (err) {
        console.error('Erro ao copiar: ', err);
        alert("Erro ao copiar o link.");
    }
}

function gerarBotoes(idPath) {
    resetInterface();
    const container = document.getElementById("btRes-container");
    const titulo = document.getElementById("titulo-dinamico");
    const idBusca = idPath.toLowerCase().replace(/[\s-_]/g, '');
    
    titulo.textContent = "MRV em " + obterNomeFormatado(idPath);
    const filtrados = dadosGerais.filter(d => d.id === idBusca);
    
    if(filtrados.length === 0) {
        container.innerHTML = "<p style='color:#999; font-style:italic;'>Nenhum residencial cadastrado.</p>";
        return;
    }

    filtrados.forEach(res => {
        const btn = document.createElement("button");
        btn.className = "btRes";
        btn.innerHTML = `<strong>${res.nome}</strong> - ${formatarEstoque(res.estoque)}`;
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
    if (res.dica) { dicaBox.innerHTML = `💡 <strong>Dica:</strong> ${res.dica}`; dicaBox.style.display = "block"; } else { dicaBox.style.display = "none"; }
    if (res.obs) { obsBox.innerHTML = `⚠️ <strong>Obs:</strong> ${res.obs}`; obsBox.style.display = "block"; } else { obsBox.style.display = "none"; }

    // Gerar botões de links dinamicamente com os novos nomes
    let botoesHTML = "";
    
    // Books em Verde
    if (res.bookCliente) botoesHTML += `<button onclick="copiarLink('${res.bookCliente}', this, '📄 Copiar Book do Cliente')" class="btn-acao btn-book">📄 Copiar Book do Cliente</button>`;
    if (res.bookCorretor) botoesHTML += `<button onclick="copiarLink('${res.bookCorretor}', this, '📄 Copiar Book do Corretor')" class="btn-acao btn-book">📄 Copiar Book do Corretor</button>`;
    
    // Vídeos e Plantas em Laranja
    if (res.video1) botoesHTML += `<button onclick="copiarLink('${res.video1}', this, '🎥 Copiar Vídeo 1')" class="btn-acao">🎥 Copiar Vídeo 1</button>`;
    if (res.video2) botoesHTML += `<button onclick="copiarLink('${res.video2}', this, '🎥 Copiar Vídeo 2')" class="btn-acao">🎥 Copiar Vídeo 2</button>`;
    if (res.apVaranda) botoesHTML += `<button onclick="copiarLink('${res.apVaranda}', this, '📐 Copiar Apart. com Varanda')" class="btn-acao">📐 Copiar Apart. com Varanda</button>`;
    if (res.apSemVaranda) botoesHTML += `<button onclick="copiarLink('${res.apSemVaranda}', this, '📐 Copiar Apart. sem Varanda')" class="btn-acao">📐 Copiar Apart. sem Varanda</button>`;
    if (res.apGarden) botoesHTML += `<button onclick="copiarLink('${res.apGarden}', this, '📐 Copiar Apart. Garden')" class="btn-acao">📐 Copiar Apart. Garden</button>`;
    if (res.outroAp) botoesHTML += `<button onclick="copiarLink('${res.outroAp}', this, '📐 Copiar Outro apart.')" class="btn-acao">📐 Copiar Outro apart.</button>`;
    
    // Localização e Diversos
    if (res.localizacaoLink) botoesHTML += `<button onclick="copiarLink('${res.localizacaoLink}', this, '📍 Copiar Localização')" class="btn-acao">📍 Copiar Localização</button>`;
    if (res.descritivo) botoesHTML += `<button onclick="copiarLink('${res.descritivo}', this, '📝 Copiar Descritivo')" class="btn-acao">📝 Copiar Descritivo</button>`;

    res.diversos.forEach((link, i) => {
        if (link) botoesHTML += `<button onclick="copiarLink('${link}', this, '🔗 Copiar Diversos ${i+1}')" class="btn-acao">🔗 Copiar Diversos ${i+1}</button>`;
    });

    infoBox.innerHTML = `
        <h3 style="color:rgb(6,94,3); margin-bottom:10px;">${res.nome} - ${formatarEstoque(res.estoque)}</h3>
        <p style="margin-bottom:10px;">📍 ${res.endereco}</p>
        <div class="grid-tecnico">
            <div><span class="label">💰 Preço:</span><br>${res.valor}</div>
            <div><span class="label">🔑 Entrega:</span><br>${res.previsao}</div>
            <div><span class="label">📐 Plantas:</span><br>${res.plantas}</div>
            <div><span class="label">🏗️ Obra:</span><br>${res.obra}%</div>
        </div>
        <div class="info-detalhada" style="margin-top:15px; font-size: 0.85em; color: #555;">
            <p>📍 <strong>Localização:</strong> ${res.local}</p>
            <p>🚲 <strong>Mobilidade:</strong> ${res.mobilidade}</p>
            <p>🎭 <strong>Cultura:</strong> ${res.cultura}</p>
            <p>🛒 <strong>Comércio:</strong> ${res.comercio}</p>
            <p>🏥 <strong>Saúde/Edu:</strong> ${res.saude}</p>
        </div>
        <div style="margin-top:20px;">
            ${botoesHTML}
        </div>`;
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

            // AÇÃO PARA QUALQUER CLIQUE: Mostrar nome no topo sempre
            display.textContent = obterNomeFormatado(p.id);

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
                display.textContent = "Toque em uma região";
                resetInterface();
            } else {
                if (pathSelecionado) pathSelecionado.classList.remove("ativo");
                pathSelecionado = p;
                p.classList.add("ativo");
                gerarBotoes(p.id);
            }
        };

        // Hover para mostrar nomes (Desktop)
        p.onmouseenter = () => {
            if (window.innerWidth >= 900 && !p.closest(".caixa-minimizada")) {
                display.textContent = obterNomeFormatado(p.id);
            }
        };
        p.onmouseleave = () => {
            if (window.innerWidth >= 900 && !p.closest(".caixa-minimizada")) {
                display.textContent = pathSelecionado ? obterNomeFormatado(pathSelecionado.id) : "Toque em uma região";
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
    document.getElementById("nome-regiao").textContent = "Toque em uma região";
    resetInterface(); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.onload = async () => { 
    await carregarDados(); 
    configurarEventos(); 
};

