const header = document.querySelector('.site-header');
const footer = document.querySelector('.site-footer');
const paginas = document.querySelectorAll('main[data-page]');
const menu = document.getElementById('menu-principal');
const botaoMenu = document.querySelector('.menu-botao');
const botaoLogin = document.getElementById('botao-login');

const paginasSemRodape = ['login', 'cadastro'];
const corDoHeader = { empresas: 'tone-cactus', login: 'tone-terracotta', cadastro: 'tone-terracotta' };
const titulos = {
  home: 'Oxente Vagas — Estágios que combinam com você',
  sobre: 'Sobre — Oxente Vagas',
  vagas: 'Vagas — Oxente Vagas',
  empresas: 'Empresas — Oxente Vagas',
  login: 'Login — Oxente Vagas',
  cadastro: 'Criar conta — Oxente Vagas'
};

function lerStorage(chave, padrao) {
  const texto = localStorage.getItem(chave);
  return texto ? JSON.parse(texto) : padrao;
}

function salvarStorage(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

function paginaAtual() {
  const nome = location.hash.slice(1);
  const existe = Array.from(paginas).some(p => p.dataset.page === nome);
  return existe ? nome : 'home';
}

function atualizarHeader(pagina) {
  header.classList.remove('tone-cactus', 'tone-terracotta');
  header.classList.toggle('is-scrolled', pagina !== 'home' || window.scrollY > 12);
  if (corDoHeader[pagina]) header.classList.add(corDoHeader[pagina]);
}

function mostrarPagina(pagina) {
  paginas.forEach(p => { p.hidden = p.dataset.page !== pagina; });
  footer.hidden = paginasSemRodape.includes(pagina);

  document.querySelectorAll('.main-nav a').forEach(link => {
    if (link.hash === '#' + pagina) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  document.title = titulos[pagina];
  fecharMenu();
  atualizarHeader(pagina);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', () => mostrarPagina(paginaAtual()));
window.addEventListener('scroll', () => atualizarHeader(paginaAtual()));

function fecharMenu() {
  menu.classList.remove('aberto');
  botaoMenu.setAttribute('aria-expanded', 'false');
}

botaoMenu.addEventListener('click', () => {
  const abriu = menu.classList.toggle('aberto');
  botaoMenu.setAttribute('aria-expanded', abriu);
});

function usuarioLogado() {
  const email = localStorage.getItem('oxente_sessao');
  return lerStorage('oxente_usuarios', []).find(u => u.email === email);
}

function atualizarBotaoLogin() {
  const usuario = usuarioLogado();
  if (usuario) {
    botaoLogin.textContent = 'Sair (' + usuario.nome.split(' ')[0] + ')';
    botaoLogin.href = '#home';
  } else {
    botaoLogin.textContent = 'Login';
    botaoLogin.href = '#login';
  }
}

botaoLogin.addEventListener('click', event => {
  if (!usuarioLogado()) return;
  event.preventDefault();
  localStorage.removeItem('oxente_sessao');
  atualizarBotaoLogin();
  marcarCandidaturas();
  location.hash = '#home';
});

function chaveCandidaturas(usuario) {
  return 'oxente_candidaturas_' + usuario.email;
}

function marcarCandidaturas() {
  const usuario = usuarioLogado();
  const enviadas = usuario ? lerStorage(chaveCandidaturas(usuario), []) : [];

  document.querySelectorAll('.vaga-card').forEach(card => {
    const botao = card.querySelector('.btn');
    const jaEnviou = enviadas.includes(card.querySelector('h3').textContent);
    botao.textContent = jaEnviou ? 'Candidatura enviada ✓' : 'Candidatar-se';
    botao.title = jaEnviou ? 'Clique para cancelar a candidatura' : '';
    botao.classList.toggle('enviada', jaEnviou);
  });
}

document.querySelectorAll('.vaga-card .btn').forEach(botao => {
  botao.addEventListener('click', event => {
    const usuario = usuarioLogado();
    if (!usuario) return;
    event.preventDefault();

    const titulo = botao.closest('.vaga-card').querySelector('h3').textContent;
    let enviadas = lerStorage(chaveCandidaturas(usuario), []);
    if (enviadas.includes(titulo)) {
      enviadas = enviadas.filter(t => t !== titulo);
    } else {
      enviadas.push(titulo);
    }
    salvarStorage(chaveCandidaturas(usuario), enviadas);
    marcarCandidaturas();
  });
});

function configurarLista(cfg) {
  const lista = document.getElementById(cfg.lista);
  const campoBusca = document.getElementById(cfg.busca);
  const selectOrdem = document.getElementById(cfg.ordem);
  const selectFiltro = cfg.filtro ? document.getElementById(cfg.filtro) : null;
  const contador = document.getElementById(cfg.contador);
  const vazio = document.getElementById(cfg.vazio);
  const cartoes = Array.from(lista.children);
  let espera;

  const salvas = lerStorage('oxente_preferencias', {})[cfg.chave];
  if (salvas) {
    selectOrdem.value = salvas.ordem;
    if (selectFiltro) selectFiltro.value = salvas.filtro;
  }

  function atualizar() {
    const termo = campoBusca.value.trim().toLowerCase();
    const area = selectFiltro ? selectFiltro.value : '';

    const visiveis = [];
    cartoes.forEach(cartao => {
      const dados = cfg.dados(cartao);
      dados.cartao = cartao;
      dados.posicao = cartoes.indexOf(cartao);
      const combina = dados.texto.includes(termo) && (area === '' || dados.area === area);
      cartao.hidden = !combina;
      if (combina) visiveis.push(dados);
    });

    visiveis.sort(cfg.ordenar[selectOrdem.value]);
    visiveis.forEach(dados => lista.appendChild(dados.cartao));

    contador.textContent = cfg.textoContador(visiveis.length);
    vazio.hidden = visiveis.length > 0;
    lista.classList.remove('carregando');

    const prefs = lerStorage('oxente_preferencias', {});
    prefs[cfg.chave] = { ordem: selectOrdem.value, filtro: selectFiltro ? selectFiltro.value : '' };
    salvarStorage('oxente_preferencias', prefs);
  }

  campoBusca.addEventListener('input', () => {
    contador.textContent = 'Buscando...';
    lista.classList.add('carregando');
    clearTimeout(espera);
    espera = setTimeout(atualizar, 300);
  });
  campoBusca.form.addEventListener('submit', event => {
    event.preventDefault();
    atualizar();
  });
  selectOrdem.addEventListener('change', atualizar);
  if (selectFiltro) selectFiltro.addEventListener('change', atualizar);

  atualizar();
  return atualizar;
}

function atualizarVagasAbertas() {
  const linhas = Array.from(document.querySelectorAll('.vaga-card .vaga-main p'));
  document.querySelectorAll('.empresa-card').forEach(card => {
    const nome = card.querySelector('h3').textContent;
    const total = linhas.filter(p => p.textContent.startsWith(nome)).length;
    let texto = total + ' vagas abertas';
    if (total === 0) texto = 'Nenhuma vaga aberta';
    if (total === 1) texto = '1 vaga aberta';
    card.querySelector('.vagas-abertas').textContent = texto;
  });
}

atualizarVagasAbertas();

const atualizarVagas = configurarLista({
  chave: 'vagas',
  lista: 'lista-vagas', busca: 'busca-vagas', ordem: 'ordem-vagas', filtro: 'filtro-area',
  contador: 'contador-vagas', vazio: 'vazio-vagas',
  textoContador: n => (n === 1 ? '1 vaga encontrada' : n + ' vagas encontradas'),
  dados: card => {
    const area = card.querySelector('.tag').textContent;
    const texto = card.querySelector('h3').textContent + ' ' + card.querySelector('.vaga-main p').textContent + ' ' + area;
    return { texto: texto.toLowerCase(), area: area, prazo: card.querySelector('time').dateTime };
  },
  ordenar: {
    recentes: (a, b) => a.posicao - b.posicao,
    prazo: (a, b) => a.prazo.localeCompare(b.prazo),
    area: (a, b) => a.area.localeCompare(b.area)
  }
});

configurarLista({
  chave: 'empresas',
  lista: 'lista-empresas', busca: 'busca-empresa', ordem: 'ordem-empresas',
  contador: 'contador-empresas', vazio: 'vazio-empresas',
  textoContador: n => (n === 1 ? '1 empresa encontrada' : n + ' empresas encontradas'),
  dados: card => {
    const nome = card.querySelector('h3').textContent;
    const setor = card.querySelector('.setor').textContent;
    return {
      texto: (nome + ' ' + setor).toLowerCase(), area: '', nome: nome, setor: setor,
      vagas: parseInt(card.querySelector('.vagas-abertas').textContent) || 0
    };
  },
  ordenar: {
    vagas: (a, b) => b.vagas - a.vagas,
    nome: (a, b) => a.nome.localeCompare(b.nome),
    setor: (a, b) => a.setor.localeCompare(b.setor)
  }
});

const buscaHome = document.getElementById('busca-vaga');
buscaHome.form.addEventListener('submit', event => {
  event.preventDefault();
  document.getElementById('busca-vagas').value = buscaHome.value;
  atualizarVagas();
  location.hash = '#vagas';
});

function mostrarMensagem(id, texto, tipo) {
  const mensagem = document.getElementById(id);
  mensagem.textContent = texto;
  mensagem.className = 'mensagem ' + tipo;
}

const botoesPerfil = document.querySelectorAll('.role-toggle button');
const paineisPerfil = document.querySelectorAll('.role-panel');
botoesPerfil.forEach(botao => {
  botao.addEventListener('click', () => {
    botoesPerfil.forEach(b => b.setAttribute('aria-pressed', b === botao));
    paineisPerfil.forEach(painel => {
      painel.hidden = painel.dataset.role !== botao.dataset.role;
      painel.disabled = painel.hidden;
    });
  });
});

const formCadastro = document.getElementById('form-cadastro');
formCadastro.addEventListener('submit', event => {
  event.preventDefault();

  const dados = Object.fromEntries(new FormData(formCadastro));
  dados.tipo = document.querySelector('.role-toggle [aria-pressed="true"]').dataset.role;
  dados.email = dados.email.trim().toLowerCase();

  const usuarios = lerStorage('oxente_usuarios', []);
  if (usuarios.some(u => u.email === dados.email)) {
    mostrarMensagem('msg-cadastro', 'Esse e-mail já está cadastrado. Tente entrar.', 'erro');
    return;
  }

  usuarios.push(dados);
  salvarStorage('oxente_usuarios', usuarios);
  formCadastro.reset();
  mostrarMensagem('msg-cadastro', 'Conta criada com sucesso! Levando você para o login...', 'sucesso');
  setTimeout(() => {
    mostrarMensagem('msg-cadastro', '', '');
    location.hash = '#login';
  }, 1500);
});

const formLogin = document.getElementById('form-login');
formLogin.addEventListener('submit', event => {
  event.preventDefault();

  const email = formLogin.elements.email.value.trim().toLowerCase();
  const senha = formLogin.elements.senha.value;
  const usuario = lerStorage('oxente_usuarios', []).find(u => u.email === email && u.senha === senha);

  if (!usuario) {
    mostrarMensagem('msg-login', 'E-mail ou senha incorretos.', 'erro');
    return;
  }

  localStorage.setItem('oxente_sessao', usuario.email);
  atualizarBotaoLogin();
  marcarCandidaturas();
  mostrarMensagem('msg-login', 'Bem-vindo(a), ' + usuario.nome.split(' ')[0] + '!', 'sucesso');
  setTimeout(() => {
    mostrarMensagem('msg-login', '', '');
    formLogin.reset();
    location.hash = '#vagas';
  }, 1000);
});

mostrarPagina(paginaAtual());
atualizarBotaoLogin();
marcarCandidaturas();