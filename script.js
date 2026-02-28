/* --- CONFIGS --- */
const LINK_PLANILHA = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTqmzCyl1ScBsPr6d4wtq3tADya58_T9DVkhcUSDgmbwNwyZoc4tPrOMUrt8kB7UJH6tiHr_KVxfS2W/pub?output=csv";
let dadosGerais = [];
let pathSelecionado = null;

const DICIONARIO_NOMES = {
    "adamantina": "Adamantina", "americana": "Americana", "andradina": "Andradina", "anhanguera": "Anhanguera", "apiai": "Apiaí", "aracatuba": "Araçatuba", "araraquara": "Araraquara", "aricanduva": "Aricanduva", "aruja": "Arujá", "assis": "Assis", "avare": "Avaré", "barretos": "Barretos", "barueri": "Barueri", "bauru": "Bauru", "birigui": "Birigui", "biritibamirim": "Biritiba Mirim", "botucatu": "Botucatu", "bragancapaulista": "Bragança Paulista", "butanta": "Butantã", "caieiras": "Caieiras", "cajamar": "Cajamar", "campinas": "Campinas", "campolimpo": "Campo Limpo", "capivari": "Capivari", "caraguatatuba": "Caraguatatuba", "carapicuiba": "Carapicuíba", "casaverde": "Casa Verde", "catanduva": "Catanduva", "cidadeademar": "Cidade Ademar", "cidadetiradentes": "Cidade Tiradentes", "cotia": "Cotia", "diadema": "Diadema", "embudasartes": "Embu das Artes", "embuguacu": "Embu-Guaçu", "ermelinomatarazzo": "Ermelino Matarazzo", "fernandopolis": "Fernandópolis", "ferrazdevasconcelos": "Ferraz de Vasconcelos", "franca": "Franca", "franciscomorato": "Francisco Morato", "francodarocha": "Franco da Rocha", "freguesiadoo": "Freguesia do Ó", "grandesaopaulo": "Grande São Paulo", "guaianases": "Guaianases", "guararema": "Guararema", "guaratinqueta": "Guaratinguetá", "guarulhos": "Guarulhos", "interlagos": "Interlagos", "ipaussu": "Ipaussu", "ipiranga": "Ipiranga", "itaim": "Itaim", "itapecericadaserra": "Itapecerica da Serra", "itapetininga": "Itapetininga", "itapeva": "Itapeva", "itapevi": "Itapevi", "itaquaquecetuba": "Itaquaquecetuba", "itaquera": "Itaquera", "itarare": "Itararé", "itu": "Itu", "jabaquara": "Jabaquara", "jaboticabal": "Jaboticabal", "jacarei": "Jacareí", "jales": "Jales", "jandira": "Jandira", "jau": "Jaú", "josebonifacio": "José Bonifácio", "jundiai": "Jundiaí", "juquitiba": "Juquitiba", "lapa": "Lapa", "limeira": "Limeira", "lins": "Lins", "mairipora": "Mairiporã", "marilia": "Marília", "maua": "Mauá", "mboimirim": "M'Boi Mirim", "miracatu": "Miracatu", "mirantedoparanapanema": "Mirante do Paranapanema", "mogidascruzes": "Mogi das Cruzes", "mogimirim": "Mogi Mirim", "mooca": "Mooca", "osasco": "Osasco", "ourinhos": "Ourinhos", "parelheiros": "Parelheiros", "penapolis": "Penápolis", "penha": "Penha", "pindamonhangaba": "Pindamonhangaba", "pinheiros": "Pinheiros", "piracicaba": "Piracicaba", "piraju": "Piraju", "piraporadobomjesus": "Pirapora do Bom Jesus", "pirassununga": "Pirassununga", "pirituba": "Pirituba", "poa": "Poá", "presidenteprudente": "Presidente Prudente", "registro": "Registro", "ribeiraopires": "Ribeirão Pires", "ribeiraopreto": "Ribeirão Preto", "riograndedaserra": "Rio Grande da Serra", "salesopolis": "Salesópolis", "santaisabel": "Santa Isabel", "santana": "Santana", "santanadeparnaiba": "Santana de Parnaíba", "santoamaro": "Santo Amaro", "santoanastacio": "Santo Anastácio", "santoandre": "Santo André", "santos": "Santos", "saobernardo": "São Bernardo do Campo", "saocaetano": "São Caetano do Sul", "saocarlos": "São Carlos", "saojoaquimdabarra": "São Joaquim da Barra", "saojoaodaboavista": "São João da Boa Vista", "saojosedoriopreto": "São José do Rio Preto", "saojosedoscampos": "São José dos Campos", "saolourenco": "São Lourenço da Serra", "saomateus": "São Mateus", "saomiguel": "São Miguel", "saoroque": "São Roque", "saovicente": "São Vicente", "se": "Sé", "sertaozinho": "Sertãozinho", "sorocaba": "Sorocaba", "sumare": "Sumaré", "suzano": "Suzano", "taboaodaserra": "Taboão da Serra", "taquaritinga": "Taquaritinga", "taubate": "Taubaté", "tremembe": "Tremembé", "tupa": "Tupã", "vargemgrande": "Vargem Grande Paulista", "vilamaria": "Vila Maria", "vilamariana": "Vila Mariana", "vilaprudente": "Vila Prudente", "votorantim": "Votorantim", "votuporanga": "Votuporanga"
};

/* --- CARREGAMENTO --- */
async function carregarDados() {
    try {
        const res = await fetch(LINK_PLANILHA + "&cb=" + Date.now());
        const csv = await res.text();
        const linhas = csv.split(/\r?\n/).filter(l => l.trim() !== "");
        const sep = linhas[0].includes(';') ? ';' : ',';

        dadosGerais = linhas.slice(1).map(linha => {
            const c = parseCSVLine(linha, sep);
            return {
                idPath: c[0]?.toLowerCase().replace(/[\s-_]/g, ''),
                residencial: c[2],
                estoque: parseInt(c[3]) || 0,
                endereco: c[4],
                valor: c[8],
                previsao: c[7],
                dica: c[17],
                obs: c[18],
                book: c[19],
                video: c[21]
            };
        }).filter(d => d.idPath);
        
        atualizarListaEsquerda(); // Popula a esquerda ao carregar
    } catch (e) { console.error(e); }
}

/* --- LOGICA DE INTERFACE --- */

function atualizarListaEsquerda() {
    const container = document.getElementById("lista-geral-esquerda");
    const mapaAtivoId = document.querySelector(".caixa-maximizada").id;
    container.innerHTML = "";

    // Pega todos os IDs de paths que existem dentro do SVG do mapa que está GRANDE
    const idsNoMapa = Array.from(document.querySelectorAll(`#${mapaAtivoId} path`)).map(p => p.id);
    
    // Filtra apenas residenciais cujos IDs de bairro estão nesse mapa
    const filtrados = dadosGerais.filter(d => idsNoMapa.includes(d.idPath));

    filtrados.forEach(res => {
        const btn = document.createElement("button");
        btn.className = "btRes";
        btn.innerHTML = `<strong>${res.residencial}</strong><br><small>${res.idPath}</small>`;
        btn.onclick = () => {
            // Simula o clique no path correspondente
            const pathAlvo = document.getElementById(res.idPath);
            if(pathAlvo) pathAlvo.dispatchEvent(new Event('click'));
        };
        container.appendChild(btn);
    });
}

function trocarMapas(el) {
    if (!el.classList.contains("caixa-minimizada")) return;
    const container = document.getElementById("mapa-area-container");
    const atualMax = document.querySelector(".caixa-maximizada");
    
    el.classList.replace("caixa-minimizada", "caixa-maximizada");
    atualMax.classList.replace("caixa-maximizada", "caixa-minimizada");
    
    container.insertBefore(el, document.getElementById("nome-regiao").nextSibling);
    
    // Reseta seleções e atualiza a lista da esquerda para o novo mapa
    resetInterface();
    atualizarListaEsquerda();
}

function configurarEventos() {
    document.querySelectorAll("path").forEach(p => {
        p.onclick = (e) => {
            if (p.closest(".caixa-minimizada")) return;
            e.stopPropagation();
            
            if (pathSelecionado === p) {
                p.classList.remove("ativo");
                pathSelecionado = null;
                resetInterface();
            } else {
                if (pathSelecionado) pathSelecionado.classList.remove("ativo");
                pathSelecionado = p;
                p.classList.add("ativo");
                document.getElementById("nome-regiao").textContent = p.id.toUpperCase();
                gerarBotoesDireita(p.id);
            }
        };
    });
}

function gerarBotoesDireita(idPath) {
    const container = document.getElementById("btRes-container");
    container.innerHTML = "";
    const filtrados = dadosGerais.filter(d => d.idPath === idPath);

    filtrados.forEach(res => {
        const btn = document.createElement("button");
        btn.className = "btRes";
        btn.innerHTML = `${res.residencial} - ${res.estoque} un.`;
        btn.onclick = () => abrirFicha(res);
        container.appendChild(btn);
    });
}

function resetInterface() {
    document.getElementById("btRes-container").innerHTML = "";
    document.getElementById("residencial-info").style.display = "none";
    document.getElementById("dica-corretor-box").style.display = "none";
    document.getElementById("obs-box").style.display = "none";
}

// Funções de apoio (parseCSVLine, abrirFicha, copiarLink) devem ser mantidas do seu código anterior...

window.onload = async () => {
    await carregarDados();
    configurarEventos();
};

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
