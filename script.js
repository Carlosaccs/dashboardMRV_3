// ... (Sua função de carregarDados permanece igual)

function configurarEventosMapa() {
    document.querySelectorAll('path').forEach(path => {
        // Hover apenas visual para mostrar nome
        path.onmouseover = () => {
            document.getElementById('nome-regiao').textContent = obterNomeFormatado(path.id);
        };

        path.onmouseout = () => {
            if (!pathSelecionado) {
                document.getElementById('nome-regiao').textContent = "Toque em uma região";
            } else {
                document.getElementById('nome-regiao').textContent = obterNomeFormatado(pathSelecionado.id);
            }
        };

        // Clique apenas em quem tem MRV
        path.onclick = (e) => {
            if (!path.classList.contains('commrv')) return; // Bloqueia outros paths
            
            if (pathSelecionado === path) {
                path.classList.remove('ativo');
                pathSelecionado = null;
                resetarDireita();
            } else {
                if (pathSelecionado) pathSelecionado.classList.remove('ativo');
                pathSelecionado = path;
                path.classList.add('ativo');
                // Chame aqui a função para gerar botões na direita
                gerarBotoesDireita(path.id);
            }
        };
    });
}

function trocarMapas(el) {
    if (!el.classList.contains('caixa-minimizada')) return;
    
    const max = document.querySelector('.caixa-maximizada');
    el.classList.replace('caixa-minimizada', 'caixa-maximizada');
    max.classList.replace('caixa-maximizada', 'caixa-minimizada');
    
    // Troca ordem no DOM
    const pai = document.getElementById('mapa-container');
    pai.appendChild(max); 

    // Limpa seleções ao trocar
    if (pathSelecionado) pathSelecionado.classList.remove('ativo');
    pathSelecionado = null;
    resetarDireita();
    // Aqui popularemos a lista da esquerda depois
}

function toggleModal(abrir) {
    document.getElementById('modalSobre').style.display = abrir ? 'flex' : 'none';
}
