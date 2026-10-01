// por falta de aula a IA será convocada como professor

(function () {
  var SCREEN_NAMES = ['home', 'sobre', 'vagas', 'empresas', 'login', 'cadastro', 'criar-perfil', 'vinculo-academico', 'atributos', 'perfil', 'empresa-painel', 'termos'];
  var HEADER_TONE_BY_SCREEN = { empresas: 'tone-cactus', login: 'tone-terracotta', cadastro: 'tone-terracotta', 'criar-perfil': 'tone-terracotta', 'vinculo-academico': 'tone-terracotta', atributos: 'tone-terracotta', perfil: 'tone-terracotta', 'empresa-painel': 'tone-navy' };
  var SCREENS_WITHOUT_FOOTER = ['login', 'cadastro', 'criar-perfil', 'vinculo-academico', 'atributos', 'perfil', 'empresa-painel'];
  var SCREENS_WITHOUT_HEADER_NAV = ['criar-perfil', 'vinculo-academico', 'atributos', 'perfil', 'empresa-painel'];

  var siteHeader = document.getElementById('site-header');
  var siteFooter = document.getElementById('site-footer');
  var screens = document.querySelectorAll('.screen');

  function getScreenFromHash() {
    var hash = (window.location.hash || '#home').replace('#', '');
    if (hash === 'cadastro-empresa') return 'cadastro';
    return SCREEN_NAMES.indexOf(hash) !== -1 ? hash : 'home';
  }

  function updateHeaderTone(screenName) {
    siteHeader.classList.remove('tone-cactus', 'tone-terracotta', 'tone-navy');
    if (screenName === 'home') {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
    } else {
      siteHeader.classList.add('is-scrolled');
      if (HEADER_TONE_BY_SCREEN[screenName]) siteHeader.classList.add(HEADER_TONE_BY_SCREEN[screenName]);
    }
  }
  function applySignupMode() {
    var accountTypeToggle = document.getElementById('cadastro-account-type');
    var cadastroSubtitle = document.getElementById('cadastro-subtitle');
    var accountTypeButtons = document.querySelectorAll('.account-type-toggle button');
    var accountTypePanels = document.querySelectorAll('.account-type-panel');
    if (!accountTypeToggle || !cadastroSubtitle || !accountTypeButtons.length) return;

    var somenteEmpresa = window.location.hash === '#cadastro-empresa';
    accountTypeToggle.toggleAttribute('hidden', somenteEmpresa);
    cadastroSubtitle.textContent = somenteEmpresa
      ? 'Cadastro exclusivo para empresas parceiras.'
      : 'Escolha o tipo de perfil pra começar.';

    if (somenteEmpresa) {
      accountTypeButtons.forEach(function (accountTypeButton) { accountTypeButton.classList.toggle('is-active', accountTypeButton.dataset.accountType === 'empresa'); });
      accountTypePanels.forEach(function (panel) { panel.classList.toggle('is-active', panel.dataset.accountType === 'empresa'); });
    } else {
      accountTypeButtons.forEach(function (accountTypeButton) { accountTypeButton.classList.toggle('is-active', accountTypeButton.dataset.accountType === 'estudante'); });
      accountTypePanels.forEach(function (panel) { panel.classList.toggle('is-active', panel.dataset.accountType === 'estudante'); });
    }
  }
// if e else não de python?
  function showScreen(screenName) {
    screens.forEach(function (screenElement) {
      screenElement.classList.toggle('is-active', screenElement.getAttribute('data-screen') === screenName);
    });
    siteFooter.classList.toggle('is-hidden', SCREENS_WITHOUT_FOOTER.indexOf(screenName) !== -1);
    siteHeader.classList.toggle('hide-nav', SCREENS_WITHOUT_HEADER_NAV.indexOf(screenName) !== -1);
    updateHeaderTone(screenName);
    if (screenName === 'cadastro') applySignupMode();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function showCurrentScreen() {
    showScreen(getScreenFromHash());
  }

  window.addEventListener('hashchange', showCurrentScreen);
  window.addEventListener('scroll', function () {
    if (getScreenFromHash() === 'home') {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
    }
  }, { passive: true });

  document.addEventListener('DOMContentLoaded', function () {
    showCurrentScreen();
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var question = item.querySelector('.faq-question');
      question.addEventListener('click', function () {
        var wasOpen = item.classList.contains('is-open');
        item.parentElement.querySelectorAll('.faq-item').forEach(function (otherItem) { otherItem.classList.remove('is-open'); });
        if (!wasOpen) item.classList.add('is-open');
      });
    });
    var toggleButtons = document.querySelectorAll('.account-type-toggle button');
    toggleButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        toggleButtons.forEach(function (siblingButton) { siblingButton.classList.remove('is-active'); });
        button.classList.add('is-active');
        var target = button.dataset.accountType;
        document.querySelectorAll('.account-type-panel').forEach(function (panel) {
          panel.classList.toggle('is-active', panel.dataset.accountType === target);
        });
        validarCadastro();
      });
    });
    var cadastroForm = document.getElementById('cadastro-form');
    var empresaNomeInput = document.getElementById('empresa-nome');
    var empresaCnpjInput = document.getElementById('empresa-cnpj');
    var empresaCnpjField = empresaCnpjInput ? empresaCnpjInput.closest('.form-field') : null;
    var empresaTelefoneInput = document.getElementById('empresa-telefone');
    var empresaEmailInput = document.getElementById('empresa-email');
    var empresaEmailField = empresaEmailInput ? empresaEmailInput.closest('.form-field') : null;
    var empresaDescricaoInput = document.getElementById('empresa-descricao');
    var empresaSenhaInput = document.getElementById('empresa-senha');
    var empresaSenhaField = empresaSenhaInput ? empresaSenhaInput.closest('.form-field') : null;
    var empresaDeclaracaoInput = document.getElementById('empresa-declaracao');
    var empresaLgpdInput = document.getElementById('empresa-lgpd');
    function formatarCNPJ(valor) {
      var digitos = valor.replace(/\D/g, '').slice(0, 14);
      digitos = digitos.replace(/^(\digitos{2})(\digitos)/, '$1.$2');
      digitos = digitos.replace(/^(\digitos{2})\.(\digitos{3})(\digitos)/, '$1.$2.$3');
      digitos = digitos.replace(/\.(\digitos{3})(\digitos)/, '.$1/$2');
      digitos = digitos.replace(/(\digitos{4})(\digitos)/, '$1-$2');
      return digitos;
    }
    if (empresaCnpjInput) {
      empresaCnpjInput.addEventListener('input', function () {
        empresaCnpjInput.value = formatarCNPJ(empresaCnpjInput.value);
      });
    }
    if (empresaTelefoneInput) {
      empresaTelefoneInput.addEventListener('input', function () {
        var digitos = empresaTelefoneInput.value.replace(/\D/g, '').slice(0, 11);
        digitos = digitos.replace(/^(\digitos{2})(\digitos)/, '($1) $2');
        digitos = digitos.replace(/(\digitos{4,5})(\digitos{1,4})$/, '$1-$2');
        empresaTelefoneInput.value = digitos;
      });
    }
    function cnpjValido(valor) {
      var cnpj = (valor || '').replace(/\D/g, '');
      if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

      function calcularDigito(base) {
        var pesos = base.length === 12
          ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
          : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        var soma = 0;
        for (var i = 0; i < base.length; i++) soma += parseInt(base[i], 10) * pesos[i];
        var resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
      }

      var base = cnpj.slice(0, 12);
      var primeiroDigito = calcularDigito(base);
      var segundoDigito = calcularDigito(base + String(primeiroDigito));
      return cnpj === base + String(primeiroDigito) + String(segundoDigito);
    }
    var DOMINIOS_GRATUITOS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'yahoo.com.br', 'live.com', 'icloud.com', 'bol.com.br', 'uol.com.br', 'terra.com.br', 'zipmail.com.br'];
    function emailCorporativoValido(valor) {
      if (!/\S+@\S+\.\S+/.test(valor)) return false;
      var dominio = valor.split('@')[1].toLowerCase().trim();
      return DOMINIOS_GRATUITOS.indexOf(dominio) === -1;
    }
// ja ta maior que o outro , não gostei
    var cadastroSubmitReveal = document.getElementById('cadastro-submit-reveal');
    var cadastroSubmitButton = document.getElementById('cadastro-submit-button');

    var logoUpload = document.getElementById('empresa-logo-upload');
    var logoInput = document.getElementById('empresa-logo-input');
    var logoPreview = document.getElementById('empresa-logo-preview');
    if (logoUpload && logoInput) {
      logoUpload.addEventListener('click', function () { logoInput.click(); });
      logoInput.addEventListener('change', function () {
        var file = logoInput.files && logoInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (event) {
          logoPreview.src = event.target.result;
          logoUpload.classList.add('has-image');
        };
        reader.readAsDataURL(file);
      });
    }

    function getSelectedAccountType() {
      var ativo = document.querySelector('.account-type-toggle button.is-active');
      return ativo ? ativo.dataset.accountType : 'estudante';
    }

    function validarCadastro() {
      if (!cadastroForm) return false;
      var accountType = getSelectedAccountType();
      var cadastroValido;

      if (accountType === 'estudante') {
        cadastroValido = true;
      } else {
        var cnpjOk = cnpjValido(empresaCnpjInput.value);
        if (empresaCnpjField) empresaCnpjField.classList.toggle('has-error', empresaCnpjInput.value.replace(/\D/g, '').length === 14 && !cnpjOk);

        var emailOk = emailCorporativoValido(empresaEmailInput.value);
        if (empresaEmailField) empresaEmailField.classList.toggle('has-error', empresaEmailInput.value !== '' && !emailOk);

        var senhaOk = empresaSenhaInput.value.length >= 8;
        if (empresaSenhaField) empresaSenhaField.classList.toggle('has-error', empresaSenhaInput.value !== '' && !senhaOk);

        var descricaoOk = empresaDescricaoInput.value.trim().length >= 10;

        cadastroValido = empresaNomeInput.value.trim().length >= 2 &&
          cnpjOk &&
          emailOk &&
          descricaoOk &&
          senhaOk &&
          !!(empresaDeclaracaoInput && empresaDeclaracaoInput.checked) &&
          !!(empresaLgpdInput && empresaLgpdInput.checked);
      }

      cadastroSubmitReveal.classList.toggle('is-visible', cadastroValido);
      cadastroSubmitButton.disabled = !cadastroValido;
      return cadastroValido;
    }

    [empresaNomeInput, empresaCnpjInput, empresaTelefoneInput, empresaEmailInput, empresaDescricaoInput, empresaSenhaInput].forEach(function (input) {
      if (input) input.addEventListener('input', validarCadastro);
    });
    [empresaDeclaracaoInput, empresaLgpdInput].forEach(function (input) {
      if (input) input.addEventListener('change', validarCadastro);
    });
    document.querySelectorAll('form[data-demo]').forEach(function (form) {
      form.addEventListener('submit', function (event) { event.preventDefault(); });
    });
    var ZOOM_MIN = 80, ZOOM_MAX = 150, ZOOM_STEP = 10, ZOOM_DEFAULT = 100;
    var zoomLevel = ZOOM_DEFAULT;

    function applyZoom() {
      document.body.style.zoom = zoomLevel + '%';
    }

    var zoomInButton = document.getElementById('zoom-in');
    var zoomOutButton = document.getElementById('zoom-out');
    var zoomResetButton = document.getElementById('zoom-reset');

    zoomInButton.addEventListener('click', function () {
      zoomLevel = Math.min(ZOOM_MAX, zoomLevel + ZOOM_STEP);
      applyZoom();
    });
    zoomOutButton.addEventListener('click', function () {
      zoomLevel = Math.max(ZOOM_MIN, zoomLevel - ZOOM_STEP);
      applyZoom();
    });
    zoomResetButton.addEventListener('click', function () {
      zoomLevel = ZOOM_DEFAULT;
      applyZoom();
    });
    var darkToggle = document.getElementById('dark-mode-toggle');
    var iconMoon = document.getElementById('icon-moon');
    var iconSun = document.getElementById('icon-sun');

    darkToggle.addEventListener('click', function () {
      var isDark = document.documentElement.classList.toggle('dark-mode');
      darkToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      darkToggle.title = isDark ? 'Desativar modo escuro' : 'Ativar modo escuro';
      darkToggle.setAttribute('aria-label', darkToggle.title);
      iconMoon.toggleAttribute('hidden', isDark);
      iconSun.toggleAttribute('hidden', !isDark);
    });
    var avatarUpload = document.getElementById('avatar-upload');
    var avatarInput = document.getElementById('avatar-input');
    var avatarPreview = document.getElementById('avatar-preview');
    var nomeInput = document.getElementById('perfil-nome');
    var emailInput = document.getElementById('perfil-email');
    var senhaInput = document.getElementById('perfil-senha');
    var senhaField = senhaInput ? senhaInput.closest('.form-field') : null;
    var confirmarSenhaInput = document.getElementById('perfil-confirmar-senha');
    var confirmarSenhaField = document.getElementById('perfil-confirmar-senha-field');
    var nascimentoInput = document.getElementById('perfil-nascimento');
    var idadeField = document.getElementById('perfil-nascimento-field');
    var cpfInput = document.getElementById('perfil-cpf');
    var telefoneInput = document.getElementById('perfil-telefone');
    var declaracaoInput = document.getElementById('perfil-declaracao');
    var lgpdInput = document.getElementById('perfil-lgpd');
    var avatarHint = document.getElementById('avatar-hint');
    var perfilSubmitReveal = document.getElementById('perfil-submit-reveal');
    var perfilSubmitButton = document.getElementById('perfil-submit-button');

    if (avatarUpload && avatarInput) {
      avatarUpload.addEventListener('click', function () { avatarInput.click(); });

      avatarInput.addEventListener('change', function () {
        var file = avatarInput.files && avatarInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (event) {
          avatarPreview.src = event.target.result;
          avatarUpload.classList.add('has-image');
          validarPerfil();
        };
        reader.readAsDataURL(file);
      });
    }
    function formatarCPF(valor) {
      var digitos = valor.replace(/\D/g, '').slice(0, 11);
      digitos = digitos.replace(/^(\digitos{3})(\digitos)/, '$1.$2');
      digitos = digitos.replace(/^(\digitos{3})\.(\digitos{3})(\digitos)/, '$1.$2.$3');
      digitos = digitos.replace(/\.(\digitos{3})(\digitos)/, '.$1-$2');
      return digitos;
    }
    function formatarTelefone(valor) {
      var digitos = valor.replace(/\D/g, '').slice(0, 11);
      digitos = digitos.replace(/^(\digitos{2})(\digitos)/, '($1) $2');
      digitos = digitos.replace(/(\digitos{5})(\digitos{1,4})$/, '$1-$2');
      return digitos;
    }
    if (cpfInput) cpfInput.addEventListener('input', function () { cpfInput.value = formatarCPF(cpfInput.value); });
    if (telefoneInput) telefoneInput.addEventListener('input', function () { telefoneInput.value = formatarTelefone(telefoneInput.value); });
    function calcularIdade(dataStr) {
      if (!dataStr) return null;
      var nascimento = new Date(dataStr + 'T00:00:00');
      if (isNaN(nascimento.getTime())) return null;
      var hoje = new Date();
      var idade = hoje.getFullYear() - nascimento.getFullYear();
      var diferencaMeses = hoje.getMonth() - nascimento.getMonth();
      if (diferencaMeses < 0 || (diferencaMeses === 0 && hoje.getDate() < nascimento.getDate())) idade--;
      return idade;
    }
    function senhaForteOk(valor) {
      return valor.length >= 8 && /[A-Za-zÀ-ÿ]/.test(valor) && /[0-9]/.test(valor);
    }
//  a IA ta me explicando de uma forma mo daora ate
    function validarPerfil() {
      var usuarioOk = nomeInput.value.trim().length >= 3;
      var emailOk = /\S+@\S+\.\S+/.test(emailInput.value);
      var senhaOk = senhaForteOk(senhaInput.value);
      if (senhaField) senhaField.classList.toggle('has-error', senhaInput.value !== '' && !senhaOk);
      var confirmarOk = senhaOk && confirmarSenhaInput.value === senhaInput.value;
      confirmarSenhaField.classList.toggle('has-error', confirmarSenhaInput.value !== '' && !confirmarOk);

      var idadeCalculada = calcularIdade(nascimentoInput.value);
      var idadeOk = idadeCalculada !== null && idadeCalculada >= 16 && idadeCalculada <= 120;
      idadeField.classList.toggle('has-error', nascimentoInput.value !== '' && !idadeOk);

      var cpfOk = cpfInput.value.replace(/\D/g, '').length === 11;
      var declaracaoOk = declaracaoInput.checked;
      var lgpdOk = lgpdInput.checked;

      var formularioValido = usuarioOk && emailOk && senhaOk && confirmarOk && idadeOk && cpfOk && declaracaoOk && lgpdOk;
      perfilSubmitReveal.classList.toggle('is-visible', formularioValido);
      perfilSubmitButton.disabled = !formularioValido;
      return formularioValido;
    }

    [nomeInput, emailInput, senhaInput, confirmarSenhaInput, nascimentoInput, cpfInput, telefoneInput].forEach(function (input) {
      if (input) input.addEventListener('input', validarPerfil);
    });
    [declaracaoInput, lgpdInput].forEach(function (input) {
      if (input) input.addEventListener('change', validarPerfil);
    });

    var perfilData = {
      nome: '', email: '', idade: '', foto: '', cpf: '', telefone: '',
      instituicao: '', curso: '', tipoEnsino: '', periodo: '', matricula: ''
    };
    var atributosSelecionados = [];

    var perfilForm = document.getElementById('perfil-form');
    if (perfilForm) {
      perfilForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (validarPerfil()) {
          perfilData.nome = nomeInput.value.trim();
          perfilData.email = emailInput.value.trim();
          perfilData.idade = String(calcularIdade(nascimentoInput.value));
          perfilData.cpf = cpfInput.value.trim();
          perfilData.telefone = telefoneInput.value.trim();
          perfilData.foto = avatarUpload.classList.contains('has-image') ? avatarPreview.src : '';
          window.location.hash = '#vinculo-academico';
        }
      });
    }
    var academicoForm = document.getElementById('academico-form');
    var instituicaoInput = document.getElementById('academico-instituicao');
    var cursoInput = document.getElementById('academico-curso');
    var cursoOutroInput = document.getElementById('academico-curso-outro');
    var tipoEnsinoInput = document.getElementById('academico-tipo-ensino');
    var periodoInput = document.getElementById('academico-periodo');
    var matriculaInput = document.getElementById('academico-matricula');
    var academicoSubmitReveal = document.getElementById('academico-submit-reveal');
    var academicoSubmitButton = document.getElementById('academico-submit-button');

    if (cursoInput && cursoOutroInput) {
      cursoInput.addEventListener('change', function () {
        var ehOutro = cursoInput.value === '__outro__';
        cursoOutroInput.toggleAttribute('hidden', !ehOutro);
        if (!ehOutro) cursoOutroInput.value = '';
        validarAcademico();
      });
    }

    function cursoEscolhido() {
      if (!cursoInput) return '';
      return cursoInput.value === '__outro__' ? cursoOutroInput.value.trim() : cursoInput.value;
    }

    function validarAcademico() {
      var instituicaoOk = instituicaoInput.value.trim().length >= 2;
      var cursoOk = cursoEscolhido().length >= 2;
      var tipoEnsinoOk = tipoEnsinoInput.value !== '';
      var periodoOk = periodoInput.value.trim().length >= 1;

      var formularioValido = instituicaoOk && cursoOk && tipoEnsinoOk && periodoOk;
      academicoSubmitReveal.classList.toggle('is-visible', formularioValido);
      academicoSubmitButton.disabled = !formularioValido;
      return formularioValido;
    }

    [instituicaoInput, cursoInput, cursoOutroInput, tipoEnsinoInput, periodoInput, matriculaInput].forEach(function (input) {
      if (input) input.addEventListener('input', validarAcademico);
    });
    if (tipoEnsinoInput) tipoEnsinoInput.addEventListener('change', validarAcademico);

    if (academicoForm) {
      academicoForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (validarAcademico()) {
          perfilData.instituicao = instituicaoInput.value.trim();
          perfilData.curso = cursoEscolhido();
          perfilData.tipoEnsino = tipoEnsinoInput.value;
          perfilData.periodo = periodoInput.value.trim();
          perfilData.matricula = matriculaInput.value.trim();
          renderAtributosCurso(perfilData.curso);
          window.location.hash = '#atributos';
        }
      });
    }
    var atributosSubmitReveal = document.getElementById('atributos-submit-reveal');
    var atributosSubmitButton = document.getElementById('atributos-submit-button');
// pausa pra dormir
// continuando
    function validarSelecaoAtributos() {
      var algumSelecionado =
        (atributosCursoGrid && atributosCursoGrid.querySelectorAll('.atributo-chip.is-selected').length > 0) ||
        (atributosGeraisGrid && atributosGeraisGrid.querySelectorAll('.atributo-chip.is-selected').length > 0);
      atributosSubmitReveal.classList.toggle('is-visible', algumSelecionado);
      atributosSubmitButton.disabled = !algumSelecionado;
    }
    function slugify(texto) {
      return texto.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^chaveAtributo-z0-9]+/g, '-').replace(/(^-+|-+$)/g, '');
    }

    var ATRIBUTOS_POR_CURSO = {
      'Administração': ['Planejamento estratégico', 'Gestão de projetos', 'Análise de indicadores (KPIs)', 'Elaboração de relatórios gerenciais', 'Gestão de processos', 'Negociação', 'Gestão financeira básica', 'Atendimento a fornecedores', 'Organização de rotinas administrativas', 'Uso de sistemas ERP'],
      'Ciência da Computação': ['Lógica de programação', 'Desenvolvimento web', 'Banco de dados', 'Estruturas de dados', 'Versionamento de código (Git)', 'Testes de software', 'Metodologias ágeis', 'Segurança da informação básica', 'Resolução de bugs', 'Documentação técnica'],
      'Informática': ['Suporte técnico', 'Manutenção de computadores', 'Redes de computadores', 'Instalação de sistemas operacionais', 'Configuração de periféricos', 'Backup e recuperação de dados', 'Atendimento ao usuário (help desk)', 'Segurança digital básica', 'Automação de tarefas simples', 'Diagnóstico de falhas em hardware'],
      'Contabilidade': ['Lançamentos contábeis', 'Conciliação bancária', 'Elaboração de balanços', 'Cálculo de tributos', 'Contas a pagar e receber', 'Folha de pagamento básica', 'Auditoria interna', 'Uso de softwares contábeis', 'Análise de demonstrações financeiras', 'Organização fiscal'],
      'Enfermagem': ['Aferição de sinais vitais', 'Curativos e procedimentos básicos', 'Administração de medicamentos', 'Registro de prontuário', 'Biossegurança', 'Atendimento pré-hospitalar', 'Cuidados com pacientes', 'Esterilização de materiais', 'Vacinação', 'Triagem de pacientes'],
      'Marketing': ['Marketing digital', 'Gestão de redes sociais', 'Criação de conteúdo', 'Copywriting', 'Análise de métricas de campanhas', 'Planejamento de campanhas', 'Branding', 'SEO básico', 'Pesquisa de mercado', 'E-mail marketing'],
      'Recursos Humanos': ['Recrutamento e seleção', 'Elaboração de descrição de cargos', 'Folha de ponto', 'Treinamento e desenvolvimento', 'Avaliação de desempenho', 'Legislação trabalhista básica', 'Onboarding de novos colaboradores', 'Clima organizacional', 'Benefícios e remuneração', 'Entrevistas comportamentais'],
      'Logística': ['Gestão de estoque', 'Planejamento de rotas', 'Controle de frota', 'Recebimento e conferência de mercadorias', 'Gestão de armazém', 'Follow-up de pedidos', 'Negociação com fornecedores', 'Indicadores logísticos (KPIs)', 'Uso de sistemas WMS', 'Otimização de processos de entrega'],
      'Engenharia Civil': ['Leitura de projetos estruturais', 'AutoCAD', 'Orçamento de obras', 'Fiscalização de obras', 'Topografia básica', 'Cálculo de materiais', 'Normas técnicas (ABNT)', 'Gestão de canteiro de obras', 'Controle de qualidade em obras', 'Elaboração de cronogramas'],
      'Engenharia Elétrica': ['Leitura de diagramas elétricos', 'Instalações elétricas', 'Automação industrial', 'Manutenção de equipamentos elétricos', 'Normas de segurança elétrica (NR10)', 'Dimensionamento de circuitos', 'Uso de multímetro e osciloscópio', 'Eletrônica básica', 'Sistemas de energia', 'Programação de CLPs'],
      'Design': ['Design gráfico', 'Photoshop', 'Illustrator', 'Design de interfaces (UI)', 'Experiência do usuário (UX)', 'Identidade visual', 'Edição de imagens', 'Tipografia', 'Criação de layouts', 'Prototipação'],
      'Direito': ['Elaboração de petições', 'Pesquisa jurisprudencial', 'Atendimento ao cliente jurídico', 'Organização de processos', 'Redação jurídica', 'Legislação civil básica', 'Legislação trabalhista básica', 'Acompanhamento processual', 'Análise de contratos', 'Mediação e conciliação'],
      'Pedagogia': ['Planejamento de aulas', 'Alfabetização', 'Educação inclusiva', 'Avaliação de aprendizagem', 'Gestão de sala de aula', 'Elaboração de material didático', 'Psicologia da educação básica', 'Ludopedagogia', 'Educação infantil', 'Acompanhamento escolar'],
      'Nutrição': ['Elaboração de cardápios', 'Avaliação nutricional', 'Educação alimentar', 'Segurança alimentar', 'Nutrição clínica básica', 'Cálculo de necessidades calóricas', 'Rotulagem de alimentos', 'Atendimento nutricional', 'Nutrição esportiva básica', 'Boas práticas de manipulação de alimentos'],
      'Química': ['Análises laboratoriais', 'Controle de qualidade', 'Manuseio de reagentes', 'Normas de segurança em laboratório', 'Titulação e técnicas analíticas', 'Preparo de soluções', 'Espectrofotometria básica', 'Documentação de resultados', 'Química analítica', 'Boas práticas de laboratório (BPL)'],
      'Meio Ambiente': ['Licenciamento ambiental', 'Gestão de resíduos', 'Educação ambiental', 'Monitoramento ambiental', 'Normas ambientais (legislação)', 'Elaboração de relatórios ambientais', 'Sustentabilidade', 'Coleta de dados de campo', 'Análise de impacto ambiental', 'Reciclagem e logística reversa']
    };

    var ATRIBUTOS_GERAIS = ['Bom diálogo', 'Carismático/a', 'Proativo/a', 'Organizado/a', 'Trabalho em equipe', 'Liderança', 'Criatividade', 'Atenção aos detalhes', 'Pontualidade', 'Adaptável a mudanças', 'Empatia', 'Resiliência', 'Boa comunicação escrita', 'Pensamento crítico', 'Boa oratória', 'Iniciativa', 'Ética profissional', 'Gestão do tempo', 'Facilidade com números', 'Raciocínio lógico', 'Facilidade de aprendizado', 'Curiosidade', 'Persistência', 'Escuta ativa', 'Trabalho sob pressão', 'Flexibilidade de horário', 'Foco em resultados', 'Assiduidade', 'Autoconfiança', 'Colaboração', 'Multitarefas', 'Inglês básico', 'Inglês intermediário', 'Inglês avançado', 'Espanhol', 'Excel avançado', 'CNH categoria B', 'Disponibilidade de manhã', 'Disponibilidade de tarde', 'Disponibilidade integral'];

    var ROTULOS_ATRIBUTOS_GERAIS = {};
    ATRIBUTOS_GERAIS.forEach(function (label) {
      ROTULOS_ATRIBUTOS_GERAIS['g-' + slugify(label)] = label;
    });

    function rotulosAtributosDoCurso(curso) {
      var lista = ATRIBUTOS_POR_CURSO[curso] || [];
      var mapa = {};
      var prefixo = 'c-' + slugify(curso || 'geral') + '-';
      lista.forEach(function (label) {
        mapa[prefixo + slugify(label)] = label;
      });
      return mapa;
    }

    function atributoChipHtml(key, label) {
      return '<button type="button" class="atributo-chip" data-atributo="' + key + '"><svg class="chip-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span>' + label + '</span></button>';
    }

    var atributosGeraisGrid = document.getElementById('atributos-gerais-grid');
    var atributosCursoGrid = document.getElementById('atributos-curso-grid');
    var atributosCursoSubtitle = document.getElementById('atributos-curso-subtitle');
    var vagaRequisitosGrid = document.getElementById('vaga-requisitos-grid');

    function bindChipToggle(container, onToggle) {
      if (!container) return;
      container.querySelectorAll('.atributo-chip').forEach(function (chip) {
        if (chip.dataset.bound) return;
        chip.dataset.bound = '1';
        chip.addEventListener('click', function () {
          chip.classList.toggle('is-selected');
          if (onToggle) onToggle();
        });
      });
    }
    var atributosGeraisHtml = ATRIBUTOS_GERAIS.map(function (label) {
      return atributoChipHtml('g-' + slugify(label), label);
    }).join('');
    if (atributosGeraisGrid) { atributosGeraisGrid.innerHTML = atributosGeraisHtml; bindChipToggle(atributosGeraisGrid, validarSelecaoAtributos); }
    if (vagaRequisitosGrid) { vagaRequisitosGrid.innerHTML = atributosGeraisHtml; }

    var rotulosAtributos = Object.assign({}, ROTULOS_ATRIBUTOS_GERAIS);
    var chavesAtributos = Object.keys(rotulosAtributos);

    function renderAtributosCurso(curso) {
      if (atributosCursoSubtitle) atributosCursoSubtitle.textContent = curso ? ('Baseados no curso: ' + curso) : '';
      if (!atributosCursoGrid) return;
      var lista = ATRIBUTOS_POR_CURSO[curso];
      if (!lista) {
        atributosCursoGrid.innerHTML = '<p class="empty-state">Ainda não temos atributos específicos pra esse curso — marque os atributos gerais abaixo.</p>';
        rotulosAtributos = Object.assign({}, ROTULOS_ATRIBUTOS_GERAIS);
        chavesAtributos = Object.keys(rotulosAtributos);
        return;
      }
      var mapa = rotulosAtributosDoCurso(curso);
      atributosCursoGrid.innerHTML = Object.keys(mapa).map(function (key) { return atributoChipHtml(key, mapa[key]); }).join('');
      bindChipToggle(atributosCursoGrid, validarSelecaoAtributos);
      rotulosAtributos = Object.assign({}, ROTULOS_ATRIBUTOS_GERAIS, mapa);
      chavesAtributos = Object.keys(rotulosAtributos);
    }

    var DADOS_POR_CURSO = {
      'Administração': { area: 'Administração', hours: '30h semanais', titles: ['Estágio em Administração de Empresas', 'Estágio em Processos Administrativos', 'Estágio em Compras', 'Estágio em Gestão de Contratos', 'Estágio em Planejamento Administrativo'], companies: ['Cerrado Sistemas', 'Baobá Corp', 'Sertão Digital', 'Litoral Norte S.A.', 'Serra Verde Engenharia'] },
      'Ciência da Computaçãp': { area: 'Tecnologia', hours: '20h semanais', titles: ['Estágio em Desenvolvimento de Software', 'Estágio em Desenvolvimento Web', 'Estágio em Ciência de Dados', 'Estágio em DevOps', 'Estágio em Testes de Software'], companies: ['Cajuína Tech', 'Pampa Software', 'Amazônia Cloud', 'Aroeira Sistemas', 'Ipê Labs'] },
      'Informática': { area: 'Tecnologia', hours: '20h semanais', titles: ['Estágio em Suporte de TI', 'Estágio em Infraestrutura de TI', 'Estágio em Redes', 'Estágio em Help Desk'], companies: ['Cajuína Tech', 'Litoral Norte S.A.', 'Aroeira Sistemas'] },
      'Contabilidade': { area: 'Finanças', hours: '30h semanais', titles: ['Estágio em Contabilidade', 'Estágio Fiscal e Tributário', 'Estágio em Contas a Pagar/Receber', 'Estágio em Auditoria Interna'], companies: ['Contmax Contabilidade', 'Cerrado Sistemas', 'Baobá Corp', 'Sertão Digital'] },
      'Enfermagem': { area: 'Saúde', hours: '24h semanais', titles: ['Estágio em Enfermagem', 'Estágio em Cuidados de Saúde', 'Estágio em Atendimento Ambulatorial', 'Estágio em Enfermagem Hospitalar'], companies: ['Clínica Vida Nova', 'Hospital Rio Doce', 'Saúde Sertão', 'Hospital Baobá'] },
      'Marketing': { area: 'Marketing', hours: '30h semanais', titles: ['Estágio em Marketing Digital', 'Estágio em Redes Sociais', 'Estágio em Growth Marketing', 'Estágio em Branding'], companies: ['Cerrado Sistemas', 'Ipê Labs', 'Cajuína Tech', 'Sertão Digital'] },
      'Recursos Humanos': { area: 'Recursos Humanos', hours: '30h semanais', titles: ['Estágio em Recursos Humanos', 'Estágio em Recrutamento e Seleção', 'Estágio em Departamento Pessoal', 'Estágio em Treinamento e Desenvolvimento'], companies: ['Baobá Corp', 'Sertão Digital', 'Cerrado Sistemas', 'Amazônia Cloud'] },
      'Logística': { area: 'Logística', hours: '25h semanais', titles: ['Estágio em Logística', 'Estágio em Supply Chain', 'Estágio em Gestão de Estoque', 'Estágio em Transportes'], companies: ['Pampa Logística', 'Amazônia Cargas', 'Litoral Norte S.A.', 'Sertão Digital'] },
      'Engenharia Civil': { area: 'Construção Civil', hours: '30h semanais', titles: ['Estágio em Obras', 'Estágio em Projetos de Edificações', 'Estágio em Orçamento de Obras', 'Estágio em Fiscalização de Obras'], companies: ['Serra Verde Engenharia', 'Litoral Norte Construtora', 'Aroeira Sistemas'] },
      'Engenharia Elétrica': { area: 'Engenharia Elétrica', hours: '20h semanais', titles: ['Estágio em Eletrônica', 'Estágio em Automação', 'Estágio em Instrumentação', 'Estágio em Instalações Elétricas'], companies: ['Cajuína Tech', 'Ipê Labs', 'Aroeira Sistemas', 'Serra Verde Engenharia'] },
      'Design': { area: 'Design', hours: '30h semanais', titles: ['Estágio em Design Gráfico', 'Estágio em UI/UX', 'Estágio em Identidade Visual'], companies: ['Ipê Labs', 'Cerrado Sistemas', 'Cajuína Tech'] },
      'Direito': { area: 'Jurídico', hours: '20h semanais', titles: ['Estágio Jurídico', 'Estágio em Contencioso', 'Estágio em Departamento Jurídico'], companies: ['Baobá Corp', 'Cerrado Sistemas', 'Sertão Digital'] },
      'Pedagogia': { area: 'Educação', hours: '25h semanais', titles: ['Estágio em Educação Infantil', 'Estágio em Apoio Pedagógico', 'Estágio em Coordenação Escolar'], companies: ['Escola Cajuína', 'Colégio Baobá', 'Instituto Sertão'] },
      'Nutrição': { area: 'Saúde', hours: '24h semanais', titles: ['Estágio em Nutrição', 'Estágio em Nutrição Clínica', 'Estágio em Segurança Alimentar'], companies: ['Saúde Sertão', 'Clínica Vida Nova', 'Hospital Rio Doce'] },
      'Química': { area: 'Química', hours: '20h semanais', titles: ['Estágio em Laboratório Químico', 'Estágio em Controle de Qualidade', 'Estágio em Análises Químicas'], companies: ['Cerrado Química', 'Amazônia Cloud', 'Serra Verde Engenharia'] },
      'Meio Ambiente': { area: 'Meio Ambiente', hours: '25h semanais', titles: ['Estágio em Gestão Ambiental', 'Estágio em Licenciamento Ambiental', 'Estágio em Sustentabilidade'], companies: ['Serra Verde Engenharia', 'Amazônia Cloud', 'Litoral Norte Construtora'] }
    };
    var DADOS_GENERICOS = { area: 'Multifuncional', hours: '30h semanais', titles: ['Estágio Administrativo', 'Estágio de Apoio Multifuncional', 'Programa de Estágio Trainee', 'Estágio em Atendimento', 'Estágio em Projetos Internos', 'Estágio em Operações'], companies: ['Cerrado Sistemas', 'Baobá Corp', 'Sertão Digital', 'Litoral Norte S.A.', 'Amazônia Cloud', 'Ipê Labs'] };
    var CIDADES = ['Natal, RN', 'Fortaleza, CE', 'Recife, PE', 'João Pessoa, PB', 'Mossoró, RN', 'Parnamirim, RN', 'Salvador, BA'];
    var MODALIDADES = ['Remoto', 'Híbrido', 'Presencial'];
    var PRAZOS = ['18/09', '22/09', '25/09', '28/09', '30/09', '02/10', '05/10', '08/10', '12/10', '15/10'];

    var vagasGeradas = [];

    function embaralhar(lista) {
      var copia = lista.slice();
      for (var i = copia.length - 1; i > 0; i--) {
        var indiceSorteado = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[indiceSorteado]] = [copia[indiceSorteado], copia[i]];
      }
      return copia;
    }

    function sortearVarios(lista, quantidade) {
      return embaralhar(lista).slice(0, Math.max(0, Math.min(quantidade, lista.length)));
    }

    function sortearUm(lista) {
      return lista[Math.floor(Math.random() * lista.length)];
    }

    function iniciais(nome) {
      var partes = nome.split(' ').filter(function (palavra) { return palavra.length && palavra[0] === palavra[0].toUpperCase(); });
      var base = partes.length ? partes : nome.split(' ');
      return base.slice(0, 2).map(function (palavra) { return palavra[0]; }).join('').toUpperCase();
    }

    function construirVaga(atributosNecessarios, matchPct, evitarChaves) {
      var dadosDoCurso = DADOS_POR_CURSO[perfilData.curso] || DADOS_GENERICOS;
      var tentativas = 0;
      var titulo, empresa, chave;
      do {
        titulo = sortearUm(dadosDoCurso.titles);
        empresa = sortearUm(dadosDoCurso.companies);
        chave = titulo + '|' + empresa;
        tentativas++;
      } while (evitarChaves && evitarChaves.has(chave) && tentativas < 20);
      if (evitarChaves) evitarChaves.add(chave);

      return {
        titulo: titulo,
        empresa: empresa,
        cidade: sortearUm(CIDADES),
        modalidade: sortearUm(MODALIDADES),
        horas: dadosDoCurso.hours,
        area: dadosDoCurso.area,
        bolsa: 400 + Math.floor(Math.random() * 13) * 50,
        prazo: sortearUm(PRAZOS),
        logo: iniciais(empresa),
        atributos: atributosNecessarios.map(function (chaveAtributo) { return rotulosAtributos[chaveAtributo] || chaveAtributo; }),
        matchPct: matchPct
      };
    }
    function gerarVagas(selecionados) {
      var vagas = [];
      var outros = chavesAtributos.filter(function (chaveAtributo) { return selecionados.indexOf(chaveAtributo) === -1; });
      var usadas = new Set();

      for (var i = 0; i < 18; i++) {
        var quantidadeAtributos = Math.max(1, Math.min(selecionados.length, 1 + Math.floor(Math.random() * 3)));
        vagas.push(construirVaga(sortearVarios(selecionados, quantidadeAtributos), 100, usadas));
      }

      for (var j = 0; j < 12; j++) {
        var quantidadeMarcados = Math.max(1, Math.floor(Math.random() * (selecionados.length + 1)));
        var quantidadeFaltantes = 1 + Math.floor(Math.random() * Math.min(3, Math.max(1, outros.length)));
        var atributosMarcados = sortearVarios(selecionados, quantidadeMarcados);
        var atributosFaltantes = sortearVarios(outros, quantidadeFaltantes);
        var necessarios = atributosMarcados.concat(atributosFaltantes);
        var matchPct = necessarios.length ? Math.round((atributosMarcados.length / necessarios.length) * 100) : 0;
        if (matchPct >= 100) matchPct = 90;
        vagas.push(construirVaga(necessarios, matchPct, usadas));
      }

      return vagas;
    }

    function escapeHtml(texto) {
      return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function vagaCardHTML(vaga) {
      var classeMatch = vaga.matchPct === 100 ? '' : 'match-badge-partial';
      var chipsAtributos = vaga.atributos.map(function (label) {
        return '<span class="atributo-tag">' + escapeHtml(label) + '</span>';
      }).join('');
      return '' +
        '<li><article class="vaga-card" data-match="' + vaga.matchPct + '">' +
          '<div class="vaga-details">' +
          '<div class="empresa-logo">' + vaga.logo + '</div>' +
          '<div>' +
              '<h3>' + vaga.titulo + '</h3>' +
             '<p class="vaga-subtitle">' + vaga.empresa + ' · ' + vaga.cidade + ' · ' + vaga.modalidade + '</p>' +
         '<ul class="vaga-tags"><li class="info-tag">' + vaga.area + '</li><li class="info-tag info-tag-sun">' + vaga.horas + '</li><li class="info-tag info-tag-sun">Bolsa R$ ' + vaga.bolsa + '</li></ul>' +
             '<div class="vaga-requisitos"><span class="vaga-requisitos-label">Atributos necessários:</span>' + chipsAtributos + '</div>' +
              '<p class="vaga-aviso-legal">Esta oportunidade é de estágio conforme Lei 11.788/08. A contratação depende de assinatura de Termo de Compromisso de Estágio (TCE) entre aluno, empresa e instituição de ensino, e de Seguro Contra Acidentes Pessoais pago pela empresa. O OxenteVagas não é contratante.</p>' +
            '</div>' +
          '</div>' +
          '<div class="vaga-aside">' +
            '<span class="match-badge ' + classeMatch + '">' + vaga.matchPct + '% de match</span>' +
            '<p class="vaga-prazo">Inscrições até ' + vaga.prazo + '</p>' +
            '<div class="vaga-actions">' +
              '<a href="#" class="button button-outline button-small" data-ver-empresa ' +
                'data-empresa-nome="' + escapeHtml(vaga.empresa) + '" ' +
                'data-empresa-area="' + escapeHtml(vaga.area) + '" ' +
                'data-empresa-cidade="' + escapeHtml(vaga.cidade) + '" ' +
                'data-empresa-modalidade="' + escapeHtml(vaga.modalidade) + '" ' +
                'data-vaga-titulo="' + escapeHtml(vaga.titulo) + '" ' +
                'data-vaga-empresa="' + escapeHtml(vaga.empresa) + '" ' +
                'data-vaga-match="' + vaga.matchPct + '">Ver empresa</a>' +
              '<a href="#" class="button button-primary button-small" data-candidatar data-vaga-titulo="' + escapeHtml(vaga.titulo) + '" data-vaga-empresa="' + escapeHtml(vaga.empresa) + '" data-vaga-match="' + vaga.matchPct + '">Candidatar-se</a>' +
            '</div>' +
          '</div>' +
        '</article></li>';
    }

    var vagasParaVoceGrid = document.getElementById('vagas-para-voce-grid');
    var vagasTodasGrid = document.getElementById('vagas-todas-grid');
    var countParaVoce = document.getElementById('count-para-voce');
    var countTodasVagas = document.getElementById('count-todas-vagas');

    function renderVagas() {
      if (!vagasParaVoceGrid || !vagasTodasGrid) return;

      if (!vagasGeradas.length) {
        var mensagemVazia = '<li class="empty-state">Volte pra etapa de atributos pra gerarmos vagas com base no seu perfil.</li>';
        vagasParaVoceGrid.innerHTML = mensagemVazia;
        vagasTodasGrid.innerHTML = mensagemVazia;
        if (countParaVoce) countParaVoce.textContent = 'Nenhuma vaga gerada ainda';
        if (countTodasVagas) countTodasVagas.textContent = 'Nenhuma vaga gerada ainda';
        return;
      }

      var vagas100 = vagasGeradas.filter(function (vaga) { return vaga.matchPct === 100; });

      vagasParaVoceGrid.innerHTML = vagas100.map(vagaCardHTML).join('');
      vagasTodasGrid.innerHTML = vagasGeradas.map(vagaCardHTML).join('');

      if (countParaVoce) countParaVoce.textContent = vagas100.length + ' vaga' + (vagas100.length === 1 ? '' : 's') + ' com 100% de compatibilidade';
      if (countTodasVagas) countTodasVagas.textContent = vagasGeradas.length + ' vagas encontradas';
    }

    if (atributosSubmitButton) {
      atributosSubmitButton.addEventListener('click', function () {
        if (!atributosSubmitButton.disabled) {
          var chipsSelecionados = [];
          if (atributosCursoGrid) chipsSelecionados = chipsSelecionados.concat(Array.prototype.slice.call(atributosCursoGrid.querySelectorAll('.atributo-chip.is-selected')));
          if (atributosGeraisGrid) chipsSelecionados = chipsSelecionados.concat(Array.prototype.slice.call(atributosGeraisGrid.querySelectorAll('.atributo-chip.is-selected')));
          var selecionados = chipsSelecionados.map(function (chip) { return chip.dataset.atributo; });
          atributosSelecionados = selecionados;
          vagasGeradas = gerarVagas(selecionados);
          renderPerfil();
          renderVagas();
          window.location.hash = '#perfil';
        }
      });
    }
    var profileName = document.getElementById('profile-name');
    var profileIdade = document.getElementById('profile-idade');
    var profileCurso = document.getElementById('profile-curso');
    var profileInstituicao = document.getElementById('profile-instituicao');
    var profileAvatar = document.getElementById('profile-avatar-large');
    var profileAvatarImage = document.getElementById('profile-avatar-img');
    var profileAtributosList = document.getElementById('profile-attrs-list');

    function renderPerfil() {
      if (!profileName) return;
      profileName.textContent = perfilData.nome || 'Seu perfil';
      profileIdade.textContent = perfilData.idade || '—';
      if (profileCurso) profileCurso.textContent = perfilData.curso || '—';
      if (profileInstituicao) profileInstituicao.textContent = perfilData.instituicao || '—';
      if (perfilData.foto) {
        profileAvatarImage.src = perfilData.foto;
        profileAvatar.classList.add('has-image');
      } else {
        profileAvatar.classList.remove('has-image');
      }

      if (profileAtributosList) {
        if (atributosSelecionados.length) {
          profileAtributosList.innerHTML = atributosSelecionados.map(function (chaveAtributo) {
            return '<span class="atributo-tag">' + (rotulosAtributos[chaveAtributo] || chaveAtributo) + '</span>';
          }).join('');
        } else {
          profileAtributosList.innerHTML = '<p class="profile-atributos-empty">Nenhum atributo selecionado ainda.</p>';
        }
      }
    }
    var passwordToggleButton = document.getElementById('password-toggle-button');
    var passwordPanel = document.getElementById('password-panel');
    if (passwordToggleButton && passwordPanel) {
      passwordToggleButton.addEventListener('click', function () {
        var aberto = passwordPanel.classList.toggle('is-open');
        passwordToggleButton.setAttribute('aria-expanded', aberto ? 'true' : 'false');
        passwordToggleButton.textContent = aberto ? 'Cancelar' : 'Alterar senha';
      });
    }
    document.querySelectorAll('.tab-button').forEach(function (button) {
      button.addEventListener('click', function () {
        var container = button.closest('.screen') || document;
        var botoesLocais = container.querySelectorAll('.tab-button');
        var painelLocais = container.querySelectorAll('.tab-panel');
        botoesLocais.forEach(function (siblingButton) { siblingButton.classList.remove('is-active'); siblingButton.setAttribute('aria-selected', 'false'); });
        painelLocais.forEach(function (panel) { panel.classList.remove('is-active'); });
        button.classList.add('is-active');
        button.setAttribute('aria-selected', 'true');
        var alvo = container.querySelector('[data-tab-panel="' + button.dataset.tab + '"]');
        if (alvo) alvo.classList.add('is-active');
      });
    });
    var candidaturas = [];
    var candidaturaAtual = null;
    var modoAtual = 'pdf';

    var candidaturaModal = document.getElementById('candidatura-modal');
    var candidaturaModalCloseButton = document.getElementById('candidatura-modal-close');
    var candidaturaVagaInfo = document.getElementById('candidatura-vaga-info');
    var submissionModeButtons = document.querySelectorAll('.submission-mode-button');
    var submissionModePanels = document.querySelectorAll('.submission-mode-panel');
    var candidaturaPdfInput = document.getElementById('candidatura-pdf-input');
    var candidaturaFileName = document.getElementById('candidatura-file-name');
    var candidaturaTexto = document.getElementById('candidatura-texto');
    var candidaturaMensagem = document.getElementById('candidatura-mensagem');
    var candidaturaAviso = document.getElementById('candidatura-aviso');
    var candidaturaSubmitButton = document.getElementById('candidatura-submit-button');
    var candidaturasList = document.getElementById('candidaturas-list');

    function abrirCandidaturaModal(titulo, empresa, matchPct) {
      if (!candidaturaModal) return;
      candidaturaAtual = { titulo: titulo, empresa: empresa, matchPct: matchPct !== undefined ? parseInt(matchPct, 10) : null };
      candidaturaVagaInfo.textContent = titulo + ' — ' + empresa;

      modoAtual = 'pdf';
      submissionModeButtons.forEach(function (modeButton) { modeButton.classList.toggle('is-active', modeButton.dataset.modo === 'pdf'); });
      submissionModePanels.forEach(function (panel) { panel.classList.toggle('is-active', panel.dataset.modoPanel === 'pdf'); });

      candidaturaPdfInput.value = '';
      candidaturaFileName.textContent = '';
      candidaturaTexto.value = '';
      candidaturaMensagem.value = '';
      candidaturaAviso.classList.remove('is-visible');

      candidaturaModal.classList.add('is-open');
    }

    function fecharCandidaturaModal() {
      if (candidaturaModal) candidaturaModal.classList.remove('is-open');
      candidaturaAtual = null;
    }
    document.addEventListener('click', function (event) {
      var botaoCandidatar = event.target.closest('[data-candidatar]');
      if (botaoCandidatar) {
        event.preventDefault();
        abrirCandidaturaModal(botaoCandidatar.dataset.vagaTitulo, botaoCandidatar.dataset.vagaEmpresa, botaoCandidatar.dataset.vagaMatch);
      }
    });

    if (candidaturaModalCloseButton) {
      candidaturaModalCloseButton.addEventListener('click', fecharCandidaturaModal);
    }
    if (candidaturaModal) {
      candidaturaModal.addEventListener('click', function (event) {
        if (event.target === candidaturaModal) fecharCandidaturaModal();
      });
    }
    var DESCRICOES_EMPRESA = [
      '{empresa} é uma empresa do setor de {area} que valoriza o desenvolvimento de jovens talentos e investe em programas de estágio estruturados.',
      '{empresa} atua na área de {area}, com um ambiente colaborativo e foco em inovação, oferecendo mentoria constante para quem está começando a carreira.',
      '{empresa} é referência em {area} na região, com um time que preza pela troca de conhecimento entre profissionais experientes e estagiários.',
      '{empresa} trabalha com {area} e busca pessoas curiosas e proativas pra somar ao time, com oportunidades reais de crescimento e efetivação.',
      '{empresa} tem forte atuação em {area} e mantém uma cultura próxima, incentivando estagiários a participar de projetos reais desde o início.'
    ];
    var descricoesCache = {};

    function gerarDescricaoEmpresa(empresa, area) {
      if (!descricoesCache[empresa]) {
        var modelo = DESCRICOES_EMPRESA[Math.floor(Math.random() * DESCRICOES_EMPRESA.length)];
        descricoesCache[empresa] = modelo.replace(/{empresa}/g, empresa).replace(/{area}/g, area);
      }
      return descricoesCache[empresa];
    }

    var empresaModal = document.getElementById('empresa-modal');
    var empresaModalCloseButton = document.getElementById('empresa-modal-close');
    var empresaModalLogo = document.getElementById('empresa-modal-logo');
    var empresaModalNome = document.getElementById('empresa-modal-nome');
    var empresaModalLocal = document.getElementById('empresa-modal-local');
    var empresaModalArea = document.getElementById('empresa-modal-area');
    var empresaModalModalidade = document.getElementById('empresa-modal-modalidade');
    var empresaModalSobre = document.getElementById('empresa-modal-sobre');
    var empresaModalDismissButton = document.getElementById('empresa-modal-dismiss-button');
    var empresaModalApplyButton = document.getElementById('empresa-modal-apply-button');
    var empresaVagaAtual = null;

    function abrirEmpresaModal(empresaInfo) {
      if (!empresaModal) return;
      empresaVagaAtual = { titulo: empresaInfo.vagaTitulo, empresa: empresaInfo.vagaEmpresa, matchPct: empresaInfo.matchPct };

      empresaModalLogo.textContent = iniciais(empresaInfo.nome);
      empresaModalNome.textContent = empresaInfo.nome;
      empresaModalLocal.textContent = empresaInfo.cidade;
      empresaModalArea.textContent = empresaInfo.area;
      empresaModalModalidade.textContent = empresaInfo.modalidade;
      empresaModalSobre.textContent = gerarDescricaoEmpresa(empresaInfo.nome, empresaInfo.area);

      empresaModal.classList.add('is-open');
    }

    function fecharEmpresaModal() {
      if (empresaModal) empresaModal.classList.remove('is-open');
    }
// vamo chegar em mil mesmo?
    document.addEventListener('click', function (event) {
      var botaoVerEmpresa = event.target.closest('[data-ver-empresa]');
      if (botaoVerEmpresa) {
        event.preventDefault();
        abrirEmpresaModal({
          nome: botaoVerEmpresa.dataset.empresaNome,
          area: botaoVerEmpresa.dataset.empresaArea,
          cidade: botaoVerEmpresa.dataset.empresaCidade,
          modalidade: botaoVerEmpresa.dataset.empresaModalidade,
          vagaTitulo: botaoVerEmpresa.dataset.vagaTitulo,
          vagaEmpresa: botaoVerEmpresa.dataset.vagaEmpresa,
          matchPct: botaoVerEmpresa.dataset.vagaMatch
        });
      }
    });

    if (empresaModalCloseButton) empresaModalCloseButton.addEventListener('click', fecharEmpresaModal);
    if (empresaModalDismissButton) empresaModalDismissButton.addEventListener('click', fecharEmpresaModal);
    if (empresaModal) {
      empresaModal.addEventListener('click', function (event) {
        if (event.target === empresaModal) fecharEmpresaModal();
      });
    }

    if (empresaModalApplyButton) {
      empresaModalApplyButton.addEventListener('click', function () {
        if (!empresaVagaAtual) return;
        fecharEmpresaModal();
        abrirCandidaturaModal(empresaVagaAtual.titulo, empresaVagaAtual.empresa, empresaVagaAtual.matchPct);
      });
    }

    submissionModeButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        modoAtual = button.dataset.modo;
        submissionModeButtons.forEach(function (modeButton) { modeButton.classList.toggle('is-active', modeButton === button); });
        submissionModePanels.forEach(function (panel) { panel.classList.toggle('is-active', panel.dataset.modoPanel === modoAtual); });
        candidaturaAviso.classList.remove('is-visible');
      });
    });

    if (candidaturaPdfInput) {
      candidaturaPdfInput.addEventListener('change', function () {
        var file = candidaturaPdfInput.files && candidaturaPdfInput.files[0];
        candidaturaFileName.textContent = file ? 'Selecionado: ' + file.name : '';
      });
    }

    if (candidaturaSubmitButton) {
      candidaturaSubmitButton.addEventListener('click', function () {
        if (!candidaturaAtual) return;

        var novaCandidatura = {
          id: 'cand-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          vagaTitulo: candidaturaAtual.titulo,
          vagaEmpresa: candidaturaAtual.empresa,
          matchPct: candidaturaAtual.matchPct,
          tipo: modoAtual,
          status: 'pendente',
          mensagem: candidaturaMensagem.value.trim(),
          candidatoNome: perfilData.nome || 'Candidato(a)',
          candidatoIdade: perfilData.idade || '',
          candidatoCurso: perfilData.curso || '',
          candidatoInstituicao: perfilData.instituicao || 'instituição não informada',
          candidatoCpf: perfilData.cpf || '',
          candidatoTelefone: perfilData.telefone || '',
          tceAnexo: '',
          seguroAnexo: '',
          chatMensagens: []
        };

        if (modoAtual === 'pdf') {
          var file = candidaturaPdfInput.files && candidaturaPdfInput.files[0];
          if (!file) {
            candidaturaAviso.textContent = 'Selecione um arquivo PDF antes de enviar.';
            candidaturaAviso.classList.add('is-visible');
            return;
          }
          novaCandidatura.nomeArquivo = file.name;
          novaCandidatura.tamanho = Math.max(1, Math.round(file.size / 1024));
        } else {
          var texto = candidaturaTexto.value.trim();
          if (!texto) {
            candidaturaAviso.textContent = 'Escreva seu currículo antes de enviar.';
            candidaturaAviso.classList.add('is-visible');
            return;
          }
          novaCandidatura.conteudo = texto;
        }

        candidaturas.unshift(novaCandidatura);
        renderCandidaturas();
        renderCandidatosEmpresa();
        fecharCandidaturaModal();
        var abaGerenciar = document.querySelector('.tab-button[data-tab="gerenciar-curriculos"]');
        if (abaGerenciar) abaGerenciar.click();
      });
    }

    var STATUS_LABEL = { pendente: 'Em análise', aceito: 'Aceita', rejeitado: 'Não selecionada' };

    function candidaturaItemHTML(candidatura) {
      var descricao = candidatura.tipo === 'pdf'
        ? 'Currículo em PDF enviado: <strong>' + escapeHtml(candidatura.nomeArquivo) + '</strong> · ' + candidatura.tamanho + ' KB'
        : 'Currículo escrito à mão · ' + escapeHtml(candidatura.conteudo.slice(0, 90)) + (candidatura.conteudo.length > 90 ? '…' : '');

      var tceAviso = candidatura.status === 'aceito'
        ? '<div class="tce-alert">A empresa aceitou sua candidatura. Acesse a Central de Formalização pra tratar do TCE e do seguro. <br><button type="button" class="button button-outline button-small tce-alert-action" data-abrir-central="' + candidatura.id + '">Abrir central de formalização</button></div>'
        : '';

      return '' +
        '<article class="candidatura-item" data-candidatura-id="' + candidatura.id + '">' +
          '<div class="item-main">' +
            '<div class="item-icon">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
            '</div>' +
            '<div>' +
              '<p class="item-title">' + escapeHtml(candidatura.vagaTitulo) + ' — ' + escapeHtml(candidatura.vagaEmpresa) + '</p>' +
              '<p class="item-meta">' + descricao + '</p>' +
              tceAviso +
            '</div>' +
          '</div>' +
          '<div class="item-actions">' +
            '<span class="status-badge ' + candidatura.status + '">' + STATUS_LABEL[candidatura.status] + '</span>' +
            '<button type="button" data-remove-candidatura="' + candidatura.id + '">Remover</button>' +
          '</div>' +
        '</article>';
    }

    function renderCandidaturas() {
      if (!candidaturasList) return;
      if (!candidaturas.length) {
        candidaturasList.innerHTML = '<p class="empty-state">Você ainda não se candidatou a nenhuma vaga.</p>';
        return;
      }
      candidaturasList.innerHTML = candidaturas.map(candidaturaItemHTML).join('');
    }

    if (candidaturasList) {
      candidaturasList.addEventListener('click', function (event) {
        var botaoRemover = event.target.closest('[data-remove-candidatura]');
        if (botaoRemover) {
          var id = botaoRemover.getAttribute('data-remove-candidatura');
          candidaturas = candidaturas.filter(function (candidatura) { return candidatura.id !== id; });
          renderCandidaturas();
          renderCandidatosEmpresa();
        }
      });
    }
// ok chegamos em mil
    var empresaData = { nome: '', cnpj: '', email: '', telefone: '', logo: '', descricao: '' };
    var vagasCriadasPelaEmpresa = [];
    if (cadastroForm) {
      cadastroForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!validarCadastro()) return;

        if (getSelectedAccountType() === 'empresa') {
          empresaData.nome = empresaNomeInput.value.trim();
          empresaData.cnpj = empresaCnpjInput.value.trim();
          empresaData.email = empresaEmailInput.value.trim();
          empresaData.telefone = empresaTelefoneInput.value.trim();
          empresaData.descricao = empresaDescricaoInput.value.trim();
          empresaData.logo = (logoUpload && logoUpload.classList.contains('has-image')) ? logoPreview.src : '';
          renderEmpresaPainel();
          window.location.hash = '#empresa-painel';
        } else {
          window.location.hash = '#criar-perfil';
        }
      });
    }
    var empresaNomeExibicao = document.getElementById('empresa-nome-exibicao');
    var empresaDescricaoExibicao = document.getElementById('empresa-descricao-exibicao');
    var empresaLogoLg = document.getElementById('empresa-logo-large');
    var empresaLogoIniciais = document.getElementById('empresa-logo-iniciais');
    var empresaLogoImg = document.getElementById('empresa-logo-img');

    function renderEmpresaPainel() {
      if (!empresaNomeExibicao) return;
      empresaNomeExibicao.textContent = empresaData.nome || 'Sua empresa';
      empresaDescricaoExibicao.textContent = empresaData.descricao || 'Complete o cadastro pra aparecer aqui.';
      empresaLogoIniciais.textContent = empresaData.nome ? iniciais(empresaData.nome) : 'EM';
      if (empresaData.logo) {
        empresaLogoImg.src = empresaData.logo;
        empresaLogoLg.classList.add('has-image');
      } else {
        empresaLogoLg.classList.remove('has-image');
      }
      renderMinhasVagas();
      renderCandidatosEmpresa();
    }
    var vagaCursosGrid = document.getElementById('vaga-cursos-grid');
    var criarVagaForm = document.getElementById('criar-vaga-form');
    var vagaTituloInput = document.getElementById('vaga-titulo');
    var vagaDescricaoInput = document.getElementById('vaga-descricao');
    var vagaCidadeInput = document.getElementById('vaga-cidade');
    var vagaBairroInput = document.getElementById('vaga-bairro');
    var vagaModalidadeInput = document.getElementById('vaga-modalidade');
    var vagaHorasInput = document.getElementById('vaga-horas');
    var vagaBolsaToggle = document.getElementById('bolsa-toggle');
    var vagaBolsaComCampos = document.getElementById('bolsa-com-campos');
    var vagaBolsaSemAviso = document.getElementById('bolsa-sem-aviso');
    var vagaBolsaValorInput = document.getElementById('vaga-bolsa-valor');
    var vagaBeneficiosInput = document.getElementById('vaga-beneficios');
    var vagaSupervisorNomeInput = document.getElementById('vaga-supervisor-nome');
    var vagaSupervisorCargoInput = document.getElementById('vaga-supervisor-cargo');
    var vagaSupervisorFormacaoInput = document.getElementById('vaga-supervisor-formacao');
    var criarVagaSubmitReveal = document.getElementById('criar-vaga-submit-reveal');
    var criarVagaSubmitButton = document.getElementById('criar-vaga-submit-button');
    var bolsaStatus = 'sim';

    if (vagaCursosGrid) {
      vagaCursosGrid.querySelectorAll('.atributo-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          chip.classList.toggle('is-selected');
          validarCriarVaga();
        });
      });
    }
// minha cabeça doí
    if (vagaBolsaToggle) {
      vagaBolsaToggle.querySelectorAll('button').forEach(function (button) {
        button.addEventListener('click', function () {
          vagaBolsaToggle.querySelectorAll('button').forEach(function (siblingButton) { siblingButton.classList.remove('is-active'); });
          button.classList.add('is-active');
          bolsaStatus = button.dataset.bolsa;
          vagaBolsaComCampos.toggleAttribute('hidden', bolsaStatus !== 'sim');
          vagaBolsaSemAviso.toggleAttribute('hidden', bolsaStatus !== 'nao');
          validarCriarVaga();
        });
      });
    }

    function validarCriarVaga() {
      var tituloOk = vagaTituloInput.value.trim().length >= 3;
      var cursosOk = vagaCursosGrid && vagaCursosGrid.querySelectorAll('.atributo-chip.is-selected').length > 0;
      var descricaoOk = vagaDescricaoInput.value.trim().length >= 10;
      var cidadeOk = vagaCidadeInput.value.trim().length >= 2;
      var bolsaOk = bolsaStatus === 'nao' || (vagaBolsaValorInput.value !== '' && parseInt(vagaBolsaValorInput.value, 10) >= 0);
      var supervisorOk = vagaSupervisorNomeInput.value.trim().length >= 3 &&
        vagaSupervisorCargoInput.value.trim().length >= 2 &&
        vagaSupervisorFormacaoInput.value.trim().length >= 3;

      var formularioValido = tituloOk && cursosOk && descricaoOk && cidadeOk && bolsaOk && supervisorOk;
      criarVagaSubmitReveal.classList.toggle('is-visible', formularioValido);
      criarVagaSubmitButton.disabled = !formularioValido;
      return formularioValido;
    }

    if (vagaRequisitosGrid) {
      vagaRequisitosGrid.querySelectorAll('.atributo-chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          chip.classList.toggle('is-selected');
        });
      });
    }

    [vagaTituloInput, vagaDescricaoInput, vagaCidadeInput, vagaBolsaValorInput, vagaSupervisorNomeInput, vagaSupervisorCargoInput, vagaSupervisorFormacaoInput].forEach(function (input) {
      if (input) input.addEventListener('input', validarCriarVaga);
    });

    if (criarVagaForm) {
      criarVagaForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!validarCriarVaga()) return;

        var cursosEscolhidos = Array.prototype.map.call(
          vagaCursosGrid.querySelectorAll('.atributo-chip.is-selected'),
          function (chip) { return chip.dataset.curso; }
        );

        var atributosChaves = vagaRequisitosGrid ? Array.prototype.map.call(
          vagaRequisitosGrid.querySelectorAll('.atributo-chip.is-selected'),
          function (chip) { return chip.dataset.atributo; }
        ) : [];

        vagasCriadasPelaEmpresa.unshift({
          id: 'vagaemp-' + Date.now(),
          titulo: vagaTituloInput.value.trim(),
          descricao: vagaDescricaoInput.value.trim(),
          cursosAceitos: cursosEscolhidos,
          cidade: vagaCidadeInput.value.trim(),
          bairro: vagaBairroInput.value.trim(),
          modalidade: vagaModalidadeInput.value,
          horas: vagaHorasInput.value,
          temBolsa: bolsaStatus === 'sim',
          bolsaValor: bolsaStatus === 'sim' ? vagaBolsaValorInput.value.trim() : '',
          beneficios: bolsaStatus === 'sim' ? vagaBeneficiosInput.value.trim() : '',
          supervisorNome: vagaSupervisorNomeInput.value.trim(),
          supervisorCargo: vagaSupervisorCargoInput.value.trim(),
          supervisorFormacao: vagaSupervisorFormacaoInput.value.trim(),
          status: 'Ativa',
          atributos: atributosChaves.map(function (chaveAtributo) { return rotulosAtributos[chaveAtributo] || chaveAtributo; })
        });
// java parecia mó daora
        renderMinhasVagas();
        criarVagaForm.reset();
        vagaCursosGrid.querySelectorAll('.atributo-chip.is-selected').forEach(function (chip) { chip.classList.remove('is-selected'); });
        if (vagaRequisitosGrid) vagaRequisitosGrid.querySelectorAll('.atributo-chip.is-selected').forEach(function (chip) { chip.classList.remove('is-selected'); });
        bolsaStatus = 'sim';
        vagaBolsaToggle.querySelectorAll('button').forEach(function (bolsaButton) { bolsaButton.classList.toggle('is-active', bolsaButton.dataset.bolsa === 'sim'); });
        vagaBolsaComCampos.toggleAttribute('hidden', false);
        vagaBolsaSemAviso.toggleAttribute('hidden', true);
        validarCriarVaga();
        var abaMinhasVagas = document.querySelector('.tab-button[data-tab="minhas-vagas"]');
        if (abaMinhasVagas) abaMinhasVagas.click();
      });
    }

    function vagaCriadaItemHTML(vaga) {
      var chipsAtributos = vaga.atributos.map(function (label) {
        return '<span class="atributo-tag">' + escapeHtml(label) + '</span>';
      }).join('');
      var cursosTexto = vaga.cursosAceitos.join(', ');
      var bolsaTexto = vaga.temBolsa
        ? 'Bolsa R$ ' + escapeHtml(vaga.bolsaValor) + (vaga.beneficios ? ' + ' + escapeHtml(vaga.beneficios) : '')
        : 'Estágio sem bolsa conforme art. 12 da Lei 11.788/08';
      return '' +
        '<article class="vaga-criada-item" data-vaga-criada-id="' + vaga.id + '">' +
          '<div class="candidato-header">' +
            '<h3>' + escapeHtml(vaga.titulo) + '</h3>' +
            '<span class="status-badge aceito">' + escapeHtml(vaga.status) + '</span>' +
          '</div>' +
          '<p class="vaga-criada-description">' + escapeHtml(vaga.descricao) + '</p>' +
          '<ul class="vaga-tags">' +
            '<li class="info-tag">' + escapeHtml(vaga.cidade) + (vaga.bairro ? ' — ' + escapeHtml(vaga.bairro) : '') + '</li>' +
            '<li class="info-tag info-tag-sun">' + escapeHtml(vaga.modalidade) + '</li>' +
            '<li class="info-tag info-tag-sun">' + escapeHtml(vaga.horas) + 'h semanais</li>' +
            '<li class="info-tag info-tag-sun">' + bolsaTexto + '</li>' +
          '</ul>' +
          '<p class="item-meta item-meta-spaced">Cursos aceitos: ' + escapeHtml(cursosTexto) + '</p>' +
          '<p class="item-meta">Supervisor: ' + escapeHtml(vaga.supervisorNome) + ' — ' + escapeHtml(vaga.supervisorCargo) + ' (' + escapeHtml(vaga.supervisorFormacao) + ')</p>' +
          (chipsAtributos ? '<div class="vaga-requisitos"><span class="vaga-requisitos-label">Requisitos técnicos:</span>' + chipsAtributos + '</div>' : '') +
          '<p class="form-field-hint vaga-criada-notice">Esta oportunidade é de estágio conforme Lei 11.788/08. A contratação depende de assinatura de Termo de Compromisso de Estágio (TCE) entre aluno, empresa e instituição de ensino, e de Seguro Contra Acidentes Pessoais pago pela empresa. O OxenteVagas não é contratante.</p>' +
          '<div class="vaga-criada-footer">' +
            '<button type="button" class="button button-outline button-small" data-remove-vaga-criada="' + vaga.id + '">Remover vaga</button>' +
          '</div>' +
        '</article>';
    }

    var minhasVagasLista = document.getElementById('minhas-vagas-lista');

    function renderMinhasVagas() {
      if (!minhasVagasLista) return;
      if (!vagasCriadasPelaEmpresa.length) {
        minhasVagasLista.innerHTML = '<p class="empty-state">Você ainda não publicou nenhuma vaga. Use a aba "Criar vaga" pra publicar a primeira.</p>';
        return;
      }
      minhasVagasLista.innerHTML = vagasCriadasPelaEmpresa.map(vagaCriadaItemHTML).join('');
    }

    if (minhasVagasLista) {
      minhasVagasLista.addEventListener('click', function (event) {
        var botaoRemover = event.target.closest('[data-remove-vaga-criada]');
        if (botaoRemover) {
          var id = botaoRemover.getAttribute('data-remove-vaga-criada');
          vagasCriadasPelaEmpresa = vagasCriadasPelaEmpresa.filter(function (vaga) { return vaga.id !== id; });
          renderMinhasVagas();
        }
      });
    }
    var candidatosEmpresaLista = document.getElementById('candidatos-empresa-lista');

    function ultimosDigitos(valor, quantidade) {
      var digitos = (valor || '').replace(/\D/g, '');
      return digitos.slice(-quantidade);
    }

    function candidatoItemHTML(candidatura) {
      var descricaoCv = candidatura.tipo === 'pdf'
        ? 'Currículo em PDF: <strong>' + escapeHtml(candidatura.nomeArquivo) + '</strong> · ' + candidatura.tamanho + ' KB'
        : escapeHtml(candidatura.conteudo);

      var matchTexto = (candidatura.matchPct !== null && candidatura.matchPct !== undefined && !isNaN(candidatura.matchPct))
        ? candidatura.matchPct + '% de compatibilidade'
        : 'Compatibilidade não calculada';

      var aprovado = candidatura.status === 'aceito';
      var cpfTexto = aprovado
        ? escapeHtml(candidatura.candidatoCpf || 'não informado')
        : 'CPF terminado em ' + (ultimosDigitos(candidatura.candidatoCpf, 4) || '••••');
      var telefoneTexto = aprovado
        ? escapeHtml(candidatura.candidatoTelefone || 'não informado')
        : 'oculto até a aprovação';

      var mensagemBloco = candidatura.mensagem
        ? '<div class="candidato-curriculo candidato-mensagem"><strong>Mensagem de apresentação:</strong><br>' + escapeHtml(candidatura.mensagem) + '</div>'
        : '';

      var tceAviso = aprovado
        ? '<div class="tce-alert">Para efetivar, solicite o <strong>Termo de Compromisso de Estágio (TCE)</strong> à instituição do estudante: <strong>' + escapeHtml(candidatura.candidatoInstituicao) + '</strong>. Sem a assinatura da faculdade, não há estágio válido.<br><button type="button" class="button button-outline button-small tce-alert-action" data-abrir-central="' + candidatura.id + '">Abrir central de formalização</button></div>'
        : '';

      var acoes = candidatura.status === 'pendente'
        ? '<div class="candidato-acoes">' +
            '<button type="button" class="button button-outline button-small" data-rejeitar-candidato="' + candidatura.id + '">Rejeitar</button>' +
            '<button type="button" class="button button-sun button-small" data-aceitar-candidato="' + candidatura.id + '">Aceitar</button>' +
          '</div>'
        : '';

      return '' +
        '<article class="candidato-item" data-candidato-id="' + candidatura.id + '">' +
          '<div class="candidato-header">' +
            '<div>' +
              '<h3>' + escapeHtml(candidatura.candidatoNome) + (candidatura.candidatoIdade ? ' · ' + escapeHtml(String(candidatura.candidatoIdade)) + ' anos' : '') + '</h3>' +
              '<p>Candidatou-se pra: ' + escapeHtml(candidatura.vagaTitulo) + ' — ' + escapeHtml(candidatura.vagaEmpresa) + '</p>' +
              '<p>' + (candidatura.candidatoCurso ? escapeHtml(candidatura.candidatoCurso) + ' · ' : '') + escapeHtml(candidatura.candidatoInstituicao) + '</p>' +
              '<p>' + cpfTexto + ' · Telefone: ' + telefoneTexto + '</p>' +
            '</div>' +
            '<span class="match-badge ' + (candidatura.matchPct === 100 ? '' : 'match-badge-partial') + '">' + matchTexto + '</span>' +
          '</div>' +
          '<div class="candidato-curriculo">' + descricaoCv + '</div>' +
          mensagemBloco +
          '<div class="item-actions item-actions-spaced">' +
            '<span class="status-badge ' + candidatura.status + '">' + STATUS_LABEL[candidatura.status] + '</span>' +
          '</div>' +
          acoes +
          tceAviso +
        '</article>';
    }
//  ta acabando
    function renderCandidatosEmpresa() {
      if (!candidatosEmpresaLista) return;
      if (!candidaturas.length) {
        candidatosEmpresaLista.innerHTML = '<p class="empty-state">Nenhuma candidatura recebida ainda.</p>';
        return;
      }
      candidatosEmpresaLista.innerHTML = candidaturas.map(candidatoItemHTML).join('');
    }
    var tceModal = document.getElementById('tce-modal');
    var tceModalCloseButton = document.getElementById('tce-modal-close');
    var tceModalNome = document.getElementById('tce-modal-nome');
    var tceModalInstituicao = document.getElementById('tce-modal-instituicao');
    var tceAnexoTceInput = document.getElementById('tce-anexo-tce-input');
    var tceAnexoSeguroInput = document.getElementById('tce-anexo-seguro-input');
    var tceAnexosStatus = document.getElementById('tce-anexos-status');
    var tceChatMensagens = document.getElementById('tce-chat-mensagens');
    var tceChatTexto = document.getElementById('tce-chat-texto');
    var tceChatSendButton = document.getElementById('tce-chat-send-button');
    var tceMinutaDownloadButton = document.getElementById('tce-minuta-download-button');
    var centralFormalizacaoId = null;
    var centralFormalizacaoAutor = 'empresa';

    function candidaturaAtualCentral() {
      return candidaturas.find(function (candidatura) { return candidatura.id === centralFormalizacaoId; });
    }

    function renderCentralFormalizacao() {
      var candidatura = candidaturaAtualCentral();
      if (!candidatura) return;

      tceModalNome.textContent = candidatura.candidatoNome;
      tceModalInstituicao.textContent = candidatura.candidatoInstituicao;

      var tceOk = !!candidatura.tceAnexo;
      var seguroOk = !!candidatura.seguroAnexo;
      tceAnexosStatus.innerHTML =
        (tceOk ? '✅ TCE anexado: ' + escapeHtml(candidatura.tceAnexo) : '⏳ TCE ainda não anexado') + ' · ' +
        (seguroOk ? '✅ Seguro anexado: ' + escapeHtml(candidatura.seguroAnexo) : '⏳ Seguro ainda não anexado');

      if (!candidatura.chatMensagens || !candidatura.chatMensagens.length) {
        tceChatMensagens.innerHTML = '<p class="tce-chat-vazio">Nenhuma mensagem ainda. Use este espaço só pra tratar de TCE, seguro e data de início.</p>';
      } else {
        tceChatMensagens.innerHTML = candidatura.chatMensagens.map(function (mensagem) {
          return '<div class="tce-msg ' + mensagem.autor + '"><span class="tce-msg-autor">' + (mensagem.autor === 'empresa' ? 'Empresa' : 'Estudante') + ' · ' + mensagem.hora + '</span>' + escapeHtml(mensagem.texto) + '</div>';
        }).join('');
        tceChatMensagens.scrollTop = tceChatMensagens.scrollHeight;
      }
    }

    function abrirCentralFormalizacao(candidaturaId, autor) {
      if (!tceModal) return;
      centralFormalizacaoId = candidaturaId;
      centralFormalizacaoAutor = autor;
      tceChatTexto.value = '';
      renderCentralFormalizacao();
      tceModal.classList.add('is-open');
    }

    function fecharCentralFormalizacao() {
      if (tceModal) tceModal.classList.remove('is-open');
    }

    if (tceModalCloseButton) tceModalCloseButton.addEventListener('click', fecharCentralFormalizacao);
    if (tceModal) {
      tceModal.addEventListener('click', function (event) {
        if (event.target === tceModal) fecharCentralFormalizacao();
      });
    }

    if (tceAnexoTceInput) {
      tceAnexoTceInput.addEventListener('change', function () {
        var candidatura = candidaturaAtualCentral();
        var file = tceAnexoTceInput.files && tceAnexoTceInput.files[0];
        if (!candidatura || !file) return;
        candidatura.tceAnexo = file.name;
        renderCentralFormalizacao();
        renderCandidatosEmpresa();
        renderCandidaturas();
      });
    }
    if (tceAnexoSeguroInput) {
      tceAnexoSeguroInput.addEventListener('change', function () {
        var candidatura = candidaturaAtualCentral();
        var file = tceAnexoSeguroInput.files && tceAnexoSeguroInput.files[0];
        if (!candidatura || !file) return;
        candidatura.seguroAnexo = file.name;
        renderCentralFormalizacao();
      });
    }
    function contemDadoPessoalSensivel(texto) {
      var pareceTelefone = /\d{4,5}[\s.-]?\d{4}/.test(texto);
      var pareceEmail = /\S+@\S+\.\S+/.test(texto);
      return pareceTelefone || pareceEmail;
    }

    function enviarMensagemChat() {
      var candidatura = candidaturaAtualCentral();
      var texto = tceChatTexto.value.trim();
      if (!candidatura || !texto) return;

      if (!candidatura.tceAnexo && contemDadoPessoalSensivel(texto)) {
        tceChatTexto.value = '';
        var aviso = document.getElementById('tce-chat-aviso');
        aviso.textContent = 'Mensagem bloqueada: nada de telefone ou e-mail pessoal antes de anexar o TCE.';
        return;
      }

      if (!candidatura.chatMensagens) candidatura.chatMensagens = [];
      var agora = new Date();
      var hora = String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0');
      candidatura.chatMensagens.push({ autor: centralFormalizacaoAutor, texto: texto, hora: hora });
      tceChatTexto.value = '';
      renderCentralFormalizacao();
    }
//  admito que sem IA ia ser imposivel pra min
    if (tceChatSendButton) tceChatSendButton.addEventListener('click', enviarMensagemChat);
    if (tceChatTexto) {
      tceChatTexto.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') { event.preventDefault(); enviarMensagemChat(); }
      });
    }
    if (tceMinutaDownloadButton) {
      tceMinutaDownloadButton.addEventListener('click', function () {
        var candidatura = candidaturaAtualCentral();
        if (!candidatura) return;
        var janela = window.open('', '_blank');
        if (!janela) return;
        janela.document.write(
          '<html><head><title>Minuta de dados para TCE</title>' +
          '<style>body{font-family:Arial,sans-serif;padding:40px;color:#222;line-height:1.6;} h1{font-size:1.3rem;} table{border-collapse:collapse;width:100%;margin-top:16px;} td{padding:8px 10px;border:1px solid #ccc;} td:first-child{font-weight:bold;width:220px;background:#f5f5f5;}</style>' +
          '</head><body>' +
          '<h1>Minuta de dados para Termo de Compromisso de Estágio (TCE)</h1>' +
          '<p>Documento gerado automaticamente pelo OxenteVagas apenas como apoio. Não substitui o TCE oficial, que deve ser assinado pelo estudante, pela empresa e pela instituição de ensino.</p>' +
          '<table>' +
            '<tr><td>Estudante</td><td>' + escapeHtml(candidatura.candidatoNome) + '</td></tr>' +
            '<tr><td>Instituição de ensino</td><td>' + escapeHtml(candidatura.candidatoInstituicao) + '</td></tr>' +
            '<tr><td>Curso</td><td>' + escapeHtml(candidatura.candidatoCurso || '-') + '</td></tr>' +
            '<tr><td>CPF do estudante</td><td>' + escapeHtml(candidatura.candidatoCpf || '-') + '</td></tr>' +
            '<tr><td>Vaga</td><td>' + escapeHtml(candidatura.vagaTitulo) + '</td></tr>' +
            '<tr><td>Empresa concedente</td><td>' + escapeHtml(candidatura.vagaEmpresa) + '</td></tr>' +
            '<tr><td>Data de geração</td><td>' + new Date().toLocaleDateString('pt-BR') + '</td></tr>' +
          '</table>' +
          '<script>window.onload = function(){ window.print(); };</' + 'script>' +
          '</body></html>'
        );
        janela.document.close();
      });
    }

    if (candidatosEmpresaLista) {
      candidatosEmpresaLista.addEventListener('click', function (event) {
        var botaoAceitar = event.target.closest('[data-aceitar-candidato]');
        var botaoRejeitar = event.target.closest('[data-rejeitar-candidato]');
        var botaoAbrirCentral = event.target.closest('[data-abrir-central]');

        if (botaoAbrirCentral) {
          abrirCentralFormalizacao(botaoAbrirCentral.getAttribute('data-abrir-central'), 'empresa');
          return;
        }

        var id = botaoAceitar ? botaoAceitar.getAttribute('data-aceitar-candidato') : (botaoRejeitar ? botaoRejeitar.getAttribute('data-rejeitar-candidato') : null);
        if (!id) return;
        var candidaturaDecidida = candidaturas.find(function (candidatura) { return candidatura.id === id; });
        if (!candidaturaDecidida) return;
        candidaturaDecidida.status = botaoAceitar ? 'aceito' : 'rejeitado';
        if (botaoAceitar && !candidaturaDecidida.chatMensagens) candidaturaDecidida.chatMensagens = [];
        renderCandidatosEmpresa();
        renderCandidaturas();
        if (botaoAceitar) abrirCentralFormalizacao(candidaturaDecidida.id, 'empresa');
      });
    }

    if (candidaturasList) {
      candidaturasList.addEventListener('click', function (event) {
        var botaoAbrirCentral = event.target.closest('[data-abrir-central]');
        if (botaoAbrirCentral) {
          abrirCentralFormalizacao(botaoAbrirCentral.getAttribute('data-abrir-central'), 'estudante');
        }
      });
    }
  });
})();
// ufa cabou