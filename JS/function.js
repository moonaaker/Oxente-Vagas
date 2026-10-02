(function () {
  var PAGES = ['home', 'sobre', 'vagas', 'empresas', 'login', 'cadastro', 'criar-perfil', 'vinculo-academico', 'atributos', 'perfil', 'empresa-painel', 'termos'];
  var TONE_BY_PAGE = { empresas: 'tom-cacto', login: 'tom-terracota', cadastro: 'tom-terracota', 'criar-perfil': 'tom-terracota', 'vinculo-academico': 'tom-terracota', atributos: 'tom-terracota', perfil: 'tom-terracota', 'empresa-painel': 'tom-marinho' };
  var HIDE_FOOTER_ON = ['login', 'cadastro', 'criar-perfil', 'vinculo-academico', 'atributos', 'perfil', 'empresa-painel'];
  var HIDE_HEADER_CENTER_ON = ['criar-perfil', 'vinculo-academico', 'atributos', 'perfil', 'empresa-painel'];

  var header = document.getElementById('cabecalho-site');
  var footer = document.getElementById('rodape-site');
  var pageEls = document.querySelectorAll('.pagina');
  var navLinks = document.querySelectorAll('[data-nav-link]');

  function currentPageFromHash() {
    var hash = (window.location.hash || '#home').replace('#', '');
    if (hash === 'cadastro-empresa') return 'cadastro';
    return PAGES.indexOf(hash) !== -1 ? hash : 'home';
  }

  function renderHeaderTone(page) {
    header.classList.remove('tom-cacto', 'tom-terracota', 'tom-marinho');
    if (page === 'home') {
      header.classList.toggle('rolado', window.scrollY > 12);
    } else {
      header.classList.add('rolado');
      if (TONE_BY_PAGE[page]) header.classList.add(TONE_BY_PAGE[page]);
    }
  }

  function aplicarModoCadastro() {
    var cadastroRoleToggle = document.getElementById('cadastro-alternador-tipo-conta');
    var cadastroSubtitulo = document.getElementById('cadastro-subtitulo');
    var botoesRole = document.querySelectorAll('.alternador-tipo-conta button');
    var paineisRole = document.querySelectorAll('.painel-tipo-conta');
    if (!cadastroRoleToggle || !cadastroSubtitulo || !botoesRole.length) return;

    var somenteEmpresa = window.location.hash === '#cadastro-empresa';
    cadastroRoleToggle.style.display = somenteEmpresa ? 'none' : '';
    cadastroSubtitulo.textContent = somenteEmpresa
      ? 'Cadastro exclusivo para empresas parceiras.'
      : 'Escolha o tipo de perfil pra começar.';

    if (somenteEmpresa) {
      botoesRole.forEach(function (b) { b.classList.toggle('ativo', b.dataset.role === 'empresa'); });
      paineisRole.forEach(function (p) { p.classList.toggle('ativo', p.dataset.role === 'empresa'); });
    } else {
      botoesRole.forEach(function (b) { b.classList.toggle('ativo', b.dataset.role === 'estudante'); });
      paineisRole.forEach(function (p) { p.classList.toggle('ativo', p.dataset.role === 'estudante'); });
    }
  }

  function showPage(page) {
    pageEls.forEach(function (el) {
      el.classList.toggle('pagina-ativa', el.getAttribute('data-page') === page);
    });
    footer.classList.toggle('oculto', HIDE_FOOTER_ON.indexOf(page) !== -1);
    header.classList.toggle('ocultar-centro', HIDE_HEADER_CENTER_ON.indexOf(page) !== -1);
    navLinks.forEach(function (link) {
      link.classList.toggle('ativo', link.getAttribute('data-page-target') === page);
    });
    renderHeaderTone(page);
    if (page === 'cadastro') aplicarModoCadastro();
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function route() {
    showPage(currentPageFromHash());
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('scroll', function () {
    if (currentPageFromHash() === 'home') {
      header.classList.toggle('rolado', window.scrollY > 12);
    }
  }, { passive: true });

  document.addEventListener('DOMContentLoaded', function () {
    route();

    document.querySelectorAll('.faq-item').forEach(function (item) {
      var question = item.querySelector('.faq-pergunta');
      question.addEventListener('click', function () {
        var wasOpen = item.classList.contains('aberto');
        item.parentElement.querySelectorAll('.faq-item').forEach(function (el) { el.classList.remove('aberto'); });
        if (!wasOpen) item.classList.add('aberto');
      });
    });

    var toggleButtons = document.querySelectorAll('.alternador-tipo-conta button');
    toggleButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        toggleButtons.forEach(function (b) { b.classList.remove('ativo'); });
        btn.classList.add('ativo');
        var target = btn.dataset.role;
        document.querySelectorAll('.painel-tipo-conta').forEach(function (panel) {
          panel.classList.toggle('ativo', panel.dataset.role === target);
        });
        validarCadastro();
      });
    });

    var cadastroForm = document.getElementById('cadastro-form');
    var empNomeInput = document.getElementById('empresa-nome');
    var empCnpjInput = document.getElementById('empresa-cnpj');
    var empCnpjField = empCnpjInput ? empCnpjInput.closest('.campo') : null;
    var empTelefoneInput = document.getElementById('empresa-telefone');
    var empEmailInput = document.getElementById('empresa-email');
    var empEmailField = empEmailInput ? empEmailInput.closest('.campo') : null;
    var empDescricaoInput = document.getElementById('empresa-descricao');
    var empSenhaInput = document.getElementById('empresa-senha');
    var empSenhaField = empSenhaInput ? empSenhaInput.closest('.campo') : null;
    var empDeclaracaoInput = document.getElementById('empresa-declaracao');
    var empLgpdInput = document.getElementById('empresa-lgpd');

    function formatarCNPJ(valor) {
      var d = valor.replace(/\D/g, '').slice(0, 14);
      d = d.replace(/^(\d{2})(\d)/, '$1.$2');
      d = d.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      d = d.replace(/\.(\d{3})(\d)/, '.$1/$2');
      d = d.replace(/(\d{4})(\d)/, '$1-$2');
      return d;
    }
    if (empCnpjInput) {
      empCnpjInput.addEventListener('input', function () {
        empCnpjInput.value = formatarCNPJ(empCnpjInput.value);
      });
    }
    if (empTelefoneInput) {
      empTelefoneInput.addEventListener('input', function () {
        var d = empTelefoneInput.value.replace(/\D/g, '').slice(0, 11);
        d = d.replace(/^(\d{2})(\d)/, '($1) $2');
        d = d.replace(/(\d{4,5})(\d{1,4})$/, '$1-$2');
        empTelefoneInput.value = d;
      });
    }

    function cnpjValido(valor) {
      var c = (valor || '').replace(/\D/g, '');
      if (c.length !== 14 || /^(\d)\1{13}$/.test(c)) return false;

      function calcularDigito(base) {
        var pesos = base.length === 12
          ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
          : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        var soma = 0;
        for (var i = 0; i < base.length; i++) soma += parseInt(base[i], 10) * pesos[i];
        var resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
      }

      var base = c.slice(0, 12);
      var d1 = calcularDigito(base);
      var d2 = calcularDigito(base + String(d1));
      return c === base + String(d1) + String(d2);
    }

    var DOMINIOS_GRATUITOS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'yahoo.com.br', 'live.com', 'icloud.com', 'bol.com.br', 'uol.com.br', 'terra.com.br', 'zipmail.com.br'];
    function emailCorporativoValido(valor) {
      if (!/\S+@\S+\.\S+/.test(valor)) return false;
      var dominio = valor.split('@')[1].toLowerCase().trim();
      return DOMINIOS_GRATUITOS.indexOf(dominio) === -1;
    }

    var cadastroNextWrap = document.getElementById('cadastro-avancar-envoltorio');
    var cadastroNextBtn = document.getElementById('cadastro-avancar-botao');

    var logoUpload = document.getElementById('envio-logo');
    var logoInput = document.getElementById('logo-entrada');
    var logoPreview = document.getElementById('logo-previa');
    if (logoUpload && logoInput) {
      logoUpload.addEventListener('click', function () { logoInput.click(); });
      logoInput.addEventListener('change', function () {
        var file = logoInput.files && logoInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
          logoPreview.src = e.target.result;
          logoUpload.classList.add('com-imagem');
        };
        reader.readAsDataURL(file);
      });
    }

    function getCadastroRole() {
      var ativo = document.querySelector('.alternador-tipo-conta button.ativo');
      return ativo ? ativo.dataset.role : 'estudante';
    }

    function validarCadastro() {
      if (!cadastroForm) return false;
      var role = getCadastroRole();
      var ok;

      if (role === 'estudante') {
        ok = true;
      } else {
        var cnpjOk = cnpjValido(empCnpjInput.value);
        if (empCnpjField) empCnpjField.classList.toggle('com-erro', empCnpjInput.value.replace(/\D/g, '').length === 14 && !cnpjOk);

        var emailOk = emailCorporativoValido(empEmailInput.value);
        if (empEmailField) empEmailField.classList.toggle('com-erro', empEmailInput.value !== '' && !emailOk);

        var senhaOk = empSenhaInput.value.length >= 8;
        if (empSenhaField) empSenhaField.classList.toggle('com-erro', empSenhaInput.value !== '' && !senhaOk);

        var descricaoOk = empDescricaoInput.value.trim().length >= 10;

        ok = empNomeInput.value.trim().length >= 2 &&
          cnpjOk &&
          emailOk &&
          descricaoOk &&
          senhaOk &&
          !!(empDeclaracaoInput && empDeclaracaoInput.checked) &&
          !!(empLgpdInput && empLgpdInput.checked);
      }

      cadastroNextWrap.classList.toggle('visivel', ok);
      cadastroNextBtn.disabled = !ok;
      return ok;
    }

    [empNomeInput, empCnpjInput, empTelefoneInput, empEmailInput, empDescricaoInput, empSenhaInput].forEach(function (input) {
      if (input) input.addEventListener('input', validarCadastro);
    });
    [empDeclaracaoInput, empLgpdInput].forEach(function (input) {
      if (input) input.addEventListener('change', validarCadastro);
    });

    document.querySelectorAll('form[data-demo]').forEach(function (form) {
      form.addEventListener('submit', function (e) { e.preventDefault(); });
    });

    var ZOOM_MIN = 80, ZOOM_MAX = 150, ZOOM_STEP = 10, ZOOM_DEFAULT = 100;
    var zoomLevel = ZOOM_DEFAULT;

    function applyZoom() {
      document.body.style.zoom = zoomLevel + '%';
    }

    var zoomInBtn = document.getElementById('zoom-aumentar');
    var zoomOutBtn = document.getElementById('zoom-diminuir');
    var zoomResetBtn = document.getElementById('zoom-restaurar');

    zoomInBtn.addEventListener('click', function () {
      zoomLevel = Math.min(ZOOM_MAX, zoomLevel + ZOOM_STEP);
      applyZoom();
    });
    zoomOutBtn.addEventListener('click', function () {
      zoomLevel = Math.max(ZOOM_MIN, zoomLevel - ZOOM_STEP);
      applyZoom();
    });
    zoomResetBtn.addEventListener('click', function () {
      zoomLevel = ZOOM_DEFAULT;
      applyZoom();
    });

    var darkToggle = document.getElementById('alternar-modo-escuro');
    var iconMoon = document.getElementById('icone-lua');
    var iconSun = document.getElementById('icone-sol');

    darkToggle.addEventListener('click', function () {
      var isDark = document.documentElement.classList.toggle('modo-escuro');
      darkToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      darkToggle.title = isDark ? 'Desativar modo escuro' : 'Ativar modo escuro';
      darkToggle.setAttribute('aria-label', darkToggle.title);
      iconMoon.style.display = isDark ? 'none' : '';
      iconSun.style.display = isDark ? '' : 'none';
    });

    var avatarUpload = document.getElementById('envio-avatar');
    var avatarInput = document.getElementById('avatar-entrada');
    var avatarPreview = document.getElementById('avatar-previa');
    var usuarioInput = document.getElementById('perfil-usuario');
    var emailInput = document.getElementById('perfil-email');
    var senhaInput = document.getElementById('perfil-senha');
    var senhaField = senhaInput ? senhaInput.closest('.campo') : null;
    var confirmarSenhaInput = document.getElementById('perfil-confirmar-senha');
    var confirmarSenhaField = document.getElementById('confirmar-senha-campo');
    var nascimentoInput = document.getElementById('perfil-nascimento');
    var idadeField = document.getElementById('idade-campo');
    var cpfInput = document.getElementById('perfil-cpf');
    var telefoneInput = document.getElementById('perfil-telefone');
    var declaracaoInput = document.getElementById('perfil-declaracao');
    var lgpdInput = document.getElementById('perfil-lgpd');
    var nextBtnWrap = document.getElementById('envoltorio-botao-avancar');
    var nextBtn = document.getElementById('botao-avancar');

    if (avatarUpload && avatarInput) {
      avatarUpload.addEventListener('click', function () { avatarInput.click(); });

      avatarInput.addEventListener('change', function () {
        var file = avatarInput.files && avatarInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
          avatarPreview.src = e.target.result;
          avatarUpload.classList.add('com-imagem');
          validarPerfil();
        };
        reader.readAsDataURL(file);
      });
    }

    function formatarCPF(valor) {
      var d = valor.replace(/\D/g, '').slice(0, 11);
      d = d.replace(/^(\d{3})(\d)/, '$1.$2');
      d = d.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
      d = d.replace(/\.(\d{3})(\d)/, '.$1-$2');
      return d;
    }
    function formatarTelefone(valor) {
      var d = valor.replace(/\D/g, '').slice(0, 11);
      d = d.replace(/^(\d{2})(\d)/, '($1) $2');
      d = d.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
      return d;
    }
    if (cpfInput) cpfInput.addEventListener('input', function () { cpfInput.value = formatarCPF(cpfInput.value); });
    if (telefoneInput) telefoneInput.addEventListener('input', function () { telefoneInput.value = formatarTelefone(telefoneInput.value); });

    function calcularIdade(dataStr) {
      if (!dataStr) return null;
      var nascimento = new Date(dataStr + 'T00:00:00');
      if (isNaN(nascimento.getTime())) return null;
      var hoje = new Date();
      var idade = hoje.getFullYear() - nascimento.getFullYear();
      var m = hoje.getMonth() - nascimento.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
      return idade;
    }

    function senhaForteOk(valor) {
      return valor.length >= 8 && /[A-Za-zÀ-ÿ]/.test(valor) && /[0-9]/.test(valor);
    }

    function validarPerfil() {
      var usuarioOk = usuarioInput.value.trim().length >= 3;
      var emailOk = /\S+@\S+\.\S+/.test(emailInput.value);
      var senhaOk = senhaForteOk(senhaInput.value);
      if (senhaField) senhaField.classList.toggle('com-erro', senhaInput.value !== '' && !senhaOk);
      var confirmarOk = senhaOk && confirmarSenhaInput.value === senhaInput.value;
      confirmarSenhaField.classList.toggle('com-erro', confirmarSenhaInput.value !== '' && !confirmarOk);

      var idadeCalculada = calcularIdade(nascimentoInput.value);
      var idadeOk = idadeCalculada !== null && idadeCalculada >= 16 && idadeCalculada <= 120;
      idadeField.classList.toggle('com-erro', nascimentoInput.value !== '' && !idadeOk);

      var cpfOk = cpfInput.value.replace(/\D/g, '').length === 11;
      var declaracaoOk = declaracaoInput.checked;
      var lgpdOk = lgpdInput.checked;

      var tudoOk = usuarioOk && emailOk && senhaOk && confirmarOk && idadeOk && cpfOk && declaracaoOk && lgpdOk;
      nextBtnWrap.classList.toggle('visivel', tudoOk);
      nextBtn.disabled = !tudoOk;
      return tudoOk;
    }

    [usuarioInput, emailInput, senhaInput, confirmarSenhaInput, nascimentoInput, cpfInput, telefoneInput].forEach(function (input) {
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
      perfilForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validarPerfil()) {
          perfilData.nome = usuarioInput.value.trim();
          perfilData.email = emailInput.value.trim();
          perfilData.idade = String(calcularIdade(nascimentoInput.value));
          perfilData.cpf = cpfInput.value.trim();
          perfilData.telefone = telefoneInput.value.trim();
          perfilData.foto = avatarUpload.classList.contains('com-imagem') ? avatarPreview.src : '';
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
    var academicoNextWrap = document.getElementById('academico-avancar-envoltorio');
    var academicoNextBtn = document.getElementById('academico-avancar-botao');

    if (cursoInput && cursoOutroInput) {
      cursoInput.addEventListener('change', function () {
        var ehOutro = cursoInput.value === '__outro__';
        cursoOutroInput.style.display = ehOutro ? 'block' : 'none';
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

      var tudoOk = instituicaoOk && cursoOk && tipoEnsinoOk && periodoOk;
      academicoNextWrap.classList.toggle('visivel', tudoOk);
      academicoNextBtn.disabled = !tudoOk;
      return tudoOk;
    }

    [instituicaoInput, cursoInput, cursoOutroInput, tipoEnsinoInput, periodoInput, matriculaInput].forEach(function (input) {
      if (input) input.addEventListener('input', validarAcademico);
    });
    if (tipoEnsinoInput) tipoEnsinoInput.addEventListener('change', validarAcademico);

    if (academicoForm) {
      academicoForm.addEventListener('submit', function (e) {
        e.preventDefault();
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

    var attrsNextWrap = document.getElementById('atributos-avancar-envoltorio');
    var attrsNextBtn = document.getElementById('atributos-avancar-botao');

    function validarSelecaoAtributos() {
      var algumSelecionado =
        (attrsGridCurso && attrsGridCurso.querySelectorAll('.chip-atributo.selecionado').length > 0) ||
        (attrsGridGeral && attrsGridGeral.querySelectorAll('.chip-atributo.selecionado').length > 0);
      attrsNextWrap.classList.toggle('visivel', algumSelecionado);
      attrsNextBtn.disabled = !algumSelecionado;
    }

    function slugify(texto) {
      return texto.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-+|-+$)/g, '');
    }

    var CURSO_ATRIBUTOS = {
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

    var GERAL_ATRIBUTOS_LISTA = ['Bom diálogo', 'Carismático/a', 'Proativo/a', 'Organizado/a', 'Trabalho em equipe', 'Liderança', 'Criatividade', 'Atenção aos detalhes', 'Pontualidade', 'Adaptável a mudanças', 'Empatia', 'Resiliência', 'Boa comunicação escrita', 'Pensamento crítico', 'Boa oratória', 'Iniciativa', 'Ética profissional', 'Gestão do tempo', 'Facilidade com números', 'Raciocínio lógico', 'Facilidade de aprendizado', 'Curiosidade', 'Persistência', 'Escuta ativa', 'Trabalho sob pressão', 'Flexibilidade de horário', 'Foco em resultados', 'Assiduidade', 'Autoconfiança', 'Colaboração', 'Multitarefas', 'Inglês básico', 'Inglês intermediário', 'Inglês avançado', 'Espanhol', 'Excel avançado', 'CNH categoria B', 'Disponibilidade de manhã', 'Disponibilidade de tarde', 'Disponibilidade integral'];

    var MAPA_GERAL = {};
    GERAL_ATRIBUTOS_LISTA.forEach(function (label) {
      MAPA_GERAL['g-' + slugify(label)] = label;
    });

    function mapaDoCurso(curso) {
      var lista = CURSO_ATRIBUTOS[curso] || [];
      var mapa = {};
      var prefixo = 'c-' + slugify(curso || 'geral') + '-';
      lista.forEach(function (label) {
        mapa[prefixo + slugify(label)] = label;
      });
      return mapa;
    }

    function chipHTML(key, label) {
      return '<button type="button" class="chip-atributo" data-attr="' + key + '"><svg class="chip-marca" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span>' + label + '</span></button>';
    }

    var attrsGridGeral = document.getElementById('grade-atributos-geral');
    var attrsGridCurso = document.getElementById('grade-atributos-curso');
    var attrsCursoSub = document.getElementById('atributos-curso-sub');
    var vagaAttrsGrid = document.getElementById('vaga-grade-atributos');

    function attachChipToggle(container, onToggle) {
      if (!container) return;
      container.querySelectorAll('.chip-atributo').forEach(function (chip) {
        if (chip.dataset.bound) return;
        chip.dataset.bound = '1';
        chip.addEventListener('click', function () {
          chip.classList.toggle('selecionado');
          if (onToggle) onToggle();
        });
      });
    }

    var GERAL_HTML = GERAL_ATRIBUTOS_LISTA.map(function (label) {
      return chipHTML('g-' + slugify(label), label);
    }).join('');
    if (attrsGridGeral) { attrsGridGeral.innerHTML = GERAL_HTML; attachChipToggle(attrsGridGeral, validarSelecaoAtributos); }
    if (vagaAttrsGrid) { vagaAttrsGrid.innerHTML = GERAL_HTML; }

    var ATTR_LABELS = Object.assign({}, MAPA_GERAL);
    var ALL_ATTR_KEYS = Object.keys(ATTR_LABELS);

    function renderAtributosCurso(curso) {
      if (attrsCursoSub) attrsCursoSub.textContent = curso ? ('Baseados no curso: ' + curso) : '';
      if (!attrsGridCurso) return;
      var lista = CURSO_ATRIBUTOS[curso];
      if (!lista) {
        attrsGridCurso.innerHTML = '<p class="estado-vazio">Ainda não temos atributos específicos pra esse curso — marque os atributos gerais abaixo.</p>';
        ATTR_LABELS = Object.assign({}, MAPA_GERAL);
        ALL_ATTR_KEYS = Object.keys(ATTR_LABELS);
        return;
      }
      var mapa = mapaDoCurso(curso);
      attrsGridCurso.innerHTML = Object.keys(mapa).map(function (key) { return chipHTML(key, mapa[key]); }).join('');
      attachChipToggle(attrsGridCurso, validarSelecaoAtributos);
      ATTR_LABELS = Object.assign({}, MAPA_GERAL, mapa);
      ALL_ATTR_KEYS = Object.keys(ATTR_LABELS);
    }

    var AREA_DATA_POR_CURSO = {
      'Administração': { area: 'Administração', hours: '30h semanais', titles: ['Estágio em Administração de Empresas', 'Estágio em Processos Administrativos', 'Estágio em Compras', 'Estágio em Gestão de Contratos', 'Estágio em Planejamento Administrativo'], companies: ['Cerrado Sistemas', 'Baobá Corp', 'Sertão Digital', 'Litoral Norte S.A.', 'Serra Verde Engenharia'] },
      'Ciência da Computação': { area: 'Tecnologia', hours: '20h semanais', titles: ['Estágio em Desenvolvimento de Software', 'Estágio em Desenvolvimento Web', 'Estágio em Ciência de Dados', 'Estágio em DevOps', 'Estágio em Testes de Software'], companies: ['Cajuína Tech', 'Pampa Software', 'Amazônia Cloud', 'Aroeira Sistemas', 'Ipê Labs'] },
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
    var GENERIC_AREA = { area: 'Multifuncional', hours: '30h semanais', titles: ['Estágio Administrativo', 'Estágio de Apoio Multifuncional', 'Programa de Estágio Trainee', 'Estágio em Atendimento', 'Estágio em Projetos Internos', 'Estágio em Operações'], companies: ['Cerrado Sistemas', 'Baobá Corp', 'Sertão Digital', 'Litoral Norte S.A.', 'Amazônia Cloud', 'Ipê Labs'] };
    var CITIES = ['Natal, RN', 'Fortaleza, CE', 'Recife, PE', 'João Pessoa, PB', 'Mossoró, RN', 'Parnamirim, RN', 'Salvador, BA'];
    var MODALITIES = ['Remoto', 'Híbrido', 'Presencial'];
    var DEADLINES = ['18/09', '22/09', '25/09', '28/09', '30/09', '02/10', '05/10', '08/10', '12/10', '15/10'];

    var vagasGeradas = [];

    function embaralhar(lista) {
      var copia = lista.slice();
      for (var i = copia.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = copia[i]; copia[i] = copia[j]; copia[j] = tmp;
      }
      return copia;
    }

    function amostrar(lista, n) {
      return embaralhar(lista).slice(0, Math.max(0, Math.min(n, lista.length)));
    }

    function escolherUm(lista) {
      return lista[Math.floor(Math.random() * lista.length)];
    }

    function iniciais(nome) {
      var partes = nome.split(' ').filter(function (p) { return p.length && p[0] === p[0].toUpperCase(); });
      var base = partes.length ? partes : nome.split(' ');
      return base.slice(0, 2).map(function (p) { return p[0]; }).join('').toUpperCase();
    }

    function construirVaga(atributosNecessarios, matchPct, evitarChaves) {
      var dados = AREA_DATA_POR_CURSO[perfilData.curso] || GENERIC_AREA;

      var tentativas = 0;
      var titulo, empresa, chave;
      do {
        titulo = escolherUm(dados.titles);
        empresa = escolherUm(dados.companies);
        chave = titulo + '|' + empresa;
        tentativas++;
      } while (evitarChaves && evitarChaves.has(chave) && tentativas < 20);
      if (evitarChaves) evitarChaves.add(chave);

      return {
        titulo: titulo,
        empresa: empresa,
        cidade: escolherUm(CITIES),
        modalidade: escolherUm(MODALITIES),
        horas: dados.hours,
        area: dados.area,
        bolsa: 400 + Math.floor(Math.random() * 13) * 50,
        prazo: escolherUm(DEADLINES),
        logo: iniciais(empresa),
        atributos: atributosNecessarios.map(function (a) { return ATTR_LABELS[a] || a; }),
        matchPct: matchPct
      };
    }

    function gerarVagas(selecionados) {
      var vagas = [];
      var outros = ALL_ATTR_KEYS.filter(function (a) { return selecionados.indexOf(a) === -1; });
      var usadas = new Set();

      for (var i = 0; i < 18; i++) {
        var k = Math.max(1, Math.min(selecionados.length, 1 + Math.floor(Math.random() * 3)));
        vagas.push(construirVaga(amostrar(selecionados, k), 100, usadas));
      }

      for (var j = 0; j < 12; j++) {

        var m = Math.max(1, Math.floor(Math.random() * (selecionados.length + 1)));
        var n = 1 + Math.floor(Math.random() * Math.min(3, Math.max(1, outros.length)));
        var partA = amostrar(selecionados, m);
        var partB = amostrar(outros, n);
        var necessarios = partA.concat(partB);
        var pct = necessarios.length ? Math.round((partA.length / necessarios.length) * 100) : 0;
        if (pct >= 100) pct = 90;
        vagas.push(construirVaga(necessarios, pct, usadas));
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

    function vagaCardHTML(v) {
      var classeMatch = v.matchPct === 100 ? '' : 'compatibilidade-parcial';
      var chipsAtributos = v.atributos.map(function (label) {
        return '<span class="etiqueta-atributo">' + escapeHtml(label) + '</span>';
      }).join('');
      return '' +
        '<article class="vaga-cartao">' +
          '<div class="vaga-main">' +
            '<div class="vaga-logo">' + v.logo + '</div>' +
            '<div>' +
              '<h3>' + v.titulo + '</h3>' +
              '<p style="margin:0;">' + v.empresa + ' · ' + v.cidade + ' · ' + v.modalidade + '</p>' +
              '<div class="vaga-tags"><span class="etiqueta">' + v.area + '</span><span class="etiqueta etiqueta-sol">' + v.horas + '</span><span class="etiqueta etiqueta-sol">Bolsa R$ ' + v.bolsa + '</span></div>' +
              '<div class="requisitos-atributos"><span class="requisitos-atributos-rotulo">Atributos necessários:</span>' + chipsAtributos + '</div>' +
              '<p class="vaga-aviso-legal">Esta oportunidade é de estágio conforme Lei 11.788/08. A contratação depende de assinatura de Termo de Compromisso de Estágio (TCE) entre aluno, empresa e instituição de ensino, e de Seguro Contra Acidentes Pessoais pago pela empresa. O OxenteVagas não é contratante.</p>' +
            '</div>' +
          '</div>' +
          '<div class="vaga-meta">' +
            '<span class="selo-compatibilidade ' + classeMatch + '">' + v.matchPct + '% de match</span>' +
            '<p class="prazo">Inscrições até ' + v.prazo + '</p>' +
            '<div class="vaga-meta-acoes">' +
              '<a href="#" class="botao botao-contorno botao-pequeno" data-ver-empresa ' +
                'data-empresa-nome="' + escapeHtml(v.empresa) + '" ' +
                'data-empresa-area="' + escapeHtml(v.area) + '" ' +
                'data-empresa-cidade="' + escapeHtml(v.cidade) + '" ' +
                'data-empresa-modalidade="' + escapeHtml(v.modalidade) + '" ' +
                'data-vaga-titulo="' + escapeHtml(v.titulo) + '" ' +
                'data-vaga-empresa="' + escapeHtml(v.empresa) + '" ' +
                'data-vaga-match="' + v.matchPct + '">Ver empresa</a>' +
              '<a href="#" class="botao botao-primario botao-pequeno" data-candidatar data-vaga-titulo="' + escapeHtml(v.titulo) + '" data-vaga-empresa="' + escapeHtml(v.empresa) + '" data-vaga-match="' + v.matchPct + '">Candidatar-se</a>' +
            '</div>' +
          '</div>' +
        '</article>';
    }

    var vagasParaVoceGrid = document.getElementById('grade-vagas-para-voce');
    var vagasTodasGrid = document.getElementById('grade-vagas-todas');
    var countParaVoce = document.getElementById('contagem-para-voce');
    var countTodasVagas = document.getElementById('contagem-todas-vagas');

    function renderVagas() {
      if (!vagasParaVoceGrid || !vagasTodasGrid) return;

      if (!vagasGeradas.length) {
        var msg = '<p class="estado-vazio">Volte pra etapa de atributos pra gerarmos vagas com base no seu perfil.</p>';
        vagasParaVoceGrid.innerHTML = msg;
        vagasTodasGrid.innerHTML = msg;
        if (countParaVoce) countParaVoce.textContent = 'Nenhuma vaga gerada ainda';
        if (countTodasVagas) countTodasVagas.textContent = 'Nenhuma vaga gerada ainda';
        return;
      }

      var vagas100 = vagasGeradas.filter(function (v) { return v.matchPct === 100; });

      vagasParaVoceGrid.innerHTML = vagas100.map(vagaCardHTML).join('');
      vagasTodasGrid.innerHTML = vagasGeradas.map(vagaCardHTML).join('');

      if (countParaVoce) countParaVoce.textContent = vagas100.length + ' vaga' + (vagas100.length === 1 ? '' : 's') + ' com 100% de compatibilidade';
      if (countTodasVagas) countTodasVagas.textContent = vagasGeradas.length + ' vagas encontradas';
    }

    if (attrsNextBtn) {
      attrsNextBtn.addEventListener('click', function () {
        if (!attrsNextBtn.disabled) {
          var chipsSelecionados = [];
          if (attrsGridCurso) chipsSelecionados = chipsSelecionados.concat(Array.prototype.slice.call(attrsGridCurso.querySelectorAll('.chip-atributo.selecionado')));
          if (attrsGridGeral) chipsSelecionados = chipsSelecionados.concat(Array.prototype.slice.call(attrsGridGeral.querySelectorAll('.chip-atributo.selecionado')));
          var selecionados = chipsSelecionados.map(function (chip) { return chip.dataset.attr; });
          atributosSelecionados = selecionados;
          vagasGeradas = gerarVagas(selecionados);
          renderPerfil();
          renderVagas();
          window.location.hash = '#perfil';
        }
      });
    }

    var profileNameEl = document.getElementById('perfil-nome');
    var profileIdadeEl = document.getElementById('perfil-idade');
    var profileCursoEl = document.getElementById('perfil-curso');
    var profileInstituicaoEl = document.getElementById('perfil-instituicao');
    var profileAvatarWrap = document.getElementById('perfil-avatar-grande');
    var profileAvatarImg = document.getElementById('perfil-avatar-img');
    var profileAttrsList = document.getElementById('perfil-lista-atributos');

    function renderPerfil() {
      if (!profileNameEl) return;
      profileNameEl.textContent = perfilData.nome || 'Seu perfil';
      profileIdadeEl.textContent = perfilData.idade || '—';
      if (profileCursoEl) profileCursoEl.textContent = perfilData.curso || '—';
      if (profileInstituicaoEl) profileInstituicaoEl.textContent = perfilData.instituicao || '—';
      if (perfilData.foto) {
        profileAvatarImg.src = perfilData.foto;
        profileAvatarWrap.classList.add('com-imagem');
      } else {
        profileAvatarWrap.classList.remove('com-imagem');
      }

      if (profileAttrsList) {
        if (atributosSelecionados.length) {
          profileAttrsList.innerHTML = atributosSelecionados.map(function (a) {
            return '<span class="etiqueta-atributo">' + (ATTR_LABELS[a] || a) + '</span>';
          }).join('');
        } else {
          profileAttrsList.innerHTML = '<p class="perfil-atributos-vazio">Nenhum atributo selecionado ainda.</p>';
        }
      }
    }

    var toggleSenhaBtn = document.getElementById('alternar-senha-botao');
    var passwordPanel = document.getElementById('painel-senha');
    if (toggleSenhaBtn && passwordPanel) {
      toggleSenhaBtn.addEventListener('click', function () {
        var aberto = passwordPanel.classList.toggle('aberto');
        toggleSenhaBtn.setAttribute('aria-expanded', aberto ? 'true' : 'false');
        toggleSenhaBtn.textContent = aberto ? 'Cancelar' : 'Alterar senha';
      });
    }

    document.querySelectorAll('.botao-aba').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var container = btn.closest('section.pagina') || document;
        var botoesLocais = container.querySelectorAll('.botao-aba');
        var painelLocais = container.querySelectorAll('.painel-aba');
        botoesLocais.forEach(function (b) { b.classList.remove('ativo'); b.setAttribute('aria-selected', 'false'); });
        painelLocais.forEach(function (p) { p.classList.remove('ativo'); });
        btn.classList.add('ativo');
        btn.setAttribute('aria-selected', 'true');
        var alvo = container.querySelector('[data-tab-panel="' + btn.dataset.tab + '"]');
        if (alvo) alvo.classList.add('ativo');
      });
    });

    var candidaturas = [];
    var candidaturaAtual = null;
    var modoAtual = 'pdf';

    var candidaturaModal = document.getElementById('candidatura-modal');
    var candidaturaModalClose = document.getElementById('candidatura-modal-fechar');
    var candidaturaVagaInfo = document.getElementById('candidatura-vaga-info');
    var modeButtons = document.querySelectorAll('.botao-modo');
    var modePanels = document.querySelectorAll('.candidatura-painel-modo');
    var candidaturaPdfInput = document.getElementById('candidatura-pdf-entrada');
    var candidaturaFileName = document.getElementById('candidatura-nome-arquivo');
    var candidaturaTexto = document.getElementById('candidatura-texto');
    var candidaturaMensagem = document.getElementById('candidatura-mensagem');
    var candidaturaAviso = document.getElementById('candidatura-aviso');
    var candidaturaEnviarBtn = document.getElementById('candidatura-enviar-botao');
    var candidaturasList = document.getElementById('candidaturas-lista');

    function abrirCandidaturaModal(titulo, empresa, matchPct) {
      if (!candidaturaModal) return;
      candidaturaAtual = { titulo: titulo, empresa: empresa, matchPct: matchPct !== undefined ? parseInt(matchPct, 10) : null };
      candidaturaVagaInfo.textContent = titulo + ' — ' + empresa;

      modoAtual = 'pdf';
      modeButtons.forEach(function (b) { b.classList.toggle('ativo', b.dataset.modo === 'pdf'); });
      modePanels.forEach(function (p) { p.classList.toggle('ativo', p.dataset.modoPanel === 'pdf'); });

      candidaturaPdfInput.value = '';
      candidaturaFileName.textContent = '';
      candidaturaTexto.value = '';
      candidaturaMensagem.value = '';
      candidaturaAviso.classList.remove('visivel');

      candidaturaModal.classList.add('aberto');
    }

    function fecharCandidaturaModal() {
      if (candidaturaModal) candidaturaModal.classList.remove('aberto');
      candidaturaAtual = null;
    }

    document.addEventListener('click', function (e) {
      var botaoCandidatar = e.target.closest('[data-candidatar]');
      if (botaoCandidatar) {
        e.preventDefault();
        abrirCandidaturaModal(botaoCandidatar.dataset.vagaTitulo, botaoCandidatar.dataset.vagaEmpresa, botaoCandidatar.dataset.vagaMatch);
      }
    });

    if (candidaturaModalClose) {
      candidaturaModalClose.addEventListener('click', fecharCandidaturaModal);
    }
    if (candidaturaModal) {
      candidaturaModal.addEventListener('click', function (e) {
        if (e.target === candidaturaModal) fecharCandidaturaModal();
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
    var empresaModalClose = document.getElementById('empresa-modal-fechar');
    var empresaModalLogo = document.getElementById('empresa-modal-logo');
    var empresaModalNome = document.getElementById('empresa-modal-nome');
    var empresaModalLocal = document.getElementById('empresa-modal-local');
    var empresaModalArea = document.getElementById('empresa-modal-area');
    var empresaModalModalidade = document.getElementById('empresa-modal-modalidade');
    var empresaModalSobre = document.getElementById('empresa-modal-sobre');
    var empresaModalFecharBtn = document.getElementById('empresa-modal-fechar-botao');
    var empresaModalCandidatarBtn = document.getElementById('empresa-modal-candidatar-botao');
    var empresaVagaAtual = null;

    function abrirEmpresaModal(dados) {
      if (!empresaModal) return;
      empresaVagaAtual = { titulo: dados.vagaTitulo, empresa: dados.vagaEmpresa, matchPct: dados.matchPct };

      empresaModalLogo.textContent = iniciais(dados.nome);
      empresaModalNome.textContent = dados.nome;
      empresaModalLocal.textContent = dados.cidade;
      empresaModalArea.textContent = dados.area;
      empresaModalModalidade.textContent = dados.modalidade;
      empresaModalSobre.textContent = gerarDescricaoEmpresa(dados.nome, dados.area);

      empresaModal.classList.add('aberto');
    }

    function fecharEmpresaModal() {
      if (empresaModal) empresaModal.classList.remove('aberto');
    }

    document.addEventListener('click', function (e) {
      var botaoVerEmpresa = e.target.closest('[data-ver-empresa]');
      if (botaoVerEmpresa) {
        e.preventDefault();
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

    if (empresaModalClose) empresaModalClose.addEventListener('click', fecharEmpresaModal);
    if (empresaModalFecharBtn) empresaModalFecharBtn.addEventListener('click', fecharEmpresaModal);
    if (empresaModal) {
      empresaModal.addEventListener('click', function (e) {
        if (e.target === empresaModal) fecharEmpresaModal();
      });
    }

    if (empresaModalCandidatarBtn) {
      empresaModalCandidatarBtn.addEventListener('click', function () {
        if (!empresaVagaAtual) return;
        fecharEmpresaModal();
        abrirCandidaturaModal(empresaVagaAtual.titulo, empresaVagaAtual.empresa, empresaVagaAtual.matchPct);
      });
    }

    modeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        modoAtual = btn.dataset.modo;
        modeButtons.forEach(function (b) { b.classList.toggle('ativo', b === btn); });
        modePanels.forEach(function (p) { p.classList.toggle('ativo', p.dataset.modoPanel === modoAtual); });
        candidaturaAviso.classList.remove('visivel');
      });
    });

    if (candidaturaPdfInput) {
      candidaturaPdfInput.addEventListener('change', function () {
        var file = candidaturaPdfInput.files && candidaturaPdfInput.files[0];
        candidaturaFileName.textContent = file ? 'Selecionado: ' + file.name : '';
      });
    }

    if (candidaturaEnviarBtn) {
      candidaturaEnviarBtn.addEventListener('click', function () {
        if (!candidaturaAtual) return;

        var nova = {
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
            candidaturaAviso.classList.add('visivel');
            return;
          }
          nova.nomeArquivo = file.name;
          nova.tamanho = Math.max(1, Math.round(file.size / 1024));
        } else {
          var texto = candidaturaTexto.value.trim();
          if (!texto) {
            candidaturaAviso.textContent = 'Escreva seu currículo antes de enviar.';
            candidaturaAviso.classList.add('visivel');
            return;
          }
          nova.conteudo = texto;
        }

        candidaturas.unshift(nova);
        renderCandidaturas();
        renderCandidatosEmpresa();
        fecharCandidaturaModal();

        var abaGerenciar = document.querySelector('.botao-aba[data-tab="gerenciar-curriculos"]');
        if (abaGerenciar) abaGerenciar.click();
      });
    }

    var STATUS_LABEL = { pendente: 'Em análise', aceito: 'Aceita', rejeitado: 'Não selecionada' };

    function candidaturaItemHTML(c) {
      var descricao = c.tipo === 'pdf'
        ? 'Currículo em PDF enviado: <strong>' + escapeHtml(c.nomeArquivo) + '</strong> · ' + c.tamanho + ' KB'
        : 'Currículo escrito à mão · ' + escapeHtml(c.conteudo.slice(0, 90)) + (c.conteudo.length > 90 ? '…' : '');

      var tceAviso = c.status === 'aceito'
        ? '<div class="tce-alerta">A empresa aceitou sua candidatura. Acesse a Central de Formalização pra tratar do TCE e do seguro. <br><button type="button" class="botao botao-contorno botao-pequeno" style="margin-top:8px;" data-abrir-central="' + c.id + '">Abrir central de formalização</button></div>'
        : '';

      return '' +
        '<div class="curriculo-item">' +
          '<div class="curriculo-principal">' +
            '<div class="curriculo-icone">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
            '</div>' +
            '<div>' +
              '<p class="curriculo-nome">' + escapeHtml(c.vagaTitulo) + ' — ' + escapeHtml(c.vagaEmpresa) + '</p>' +
              '<p class="curriculo-meta">' + descricao + '</p>' +
              tceAviso +
            '</div>' +
          '</div>' +
          '<div class="curriculo-acoes">' +
            '<span class="selo-status ' + c.status + '">' + STATUS_LABEL[c.status] + '</span>' +
            '<button type="button" data-remove-candidatura="' + c.id + '">Remover</button>' +
          '</div>' +
        '</div>';
    }

    function renderCandidaturas() {
      if (!candidaturasList) return;
      if (!candidaturas.length) {
        candidaturasList.innerHTML = '<p class="estado-vazio">Você ainda não se candidatou a nenhuma vaga.</p>';
        return;
      }
      candidaturasList.innerHTML = candidaturas.map(candidaturaItemHTML).join('');
    }

    if (candidaturasList) {
      candidaturasList.addEventListener('click', function (e) {
        var botaoRemover = e.target.closest('[data-remove-candidatura]');
        if (botaoRemover) {
          var id = botaoRemover.getAttribute('data-remove-candidatura');
          candidaturas = candidaturas.filter(function (c) { return c.id !== id; });
          renderCandidaturas();
          renderCandidatosEmpresa();
        }
      });
    }

    var empresaData = { nome: '', cnpj: '', email: '', telefone: '', logo: '', descricao: '' };
    var vagasCriadasPelaEmpresa = [];

    if (cadastroForm) {
      cadastroForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validarCadastro()) return;

        if (getCadastroRole() === 'empresa') {
          empresaData.nome = empNomeInput.value.trim();
          empresaData.cnpj = empCnpjInput.value.trim();
          empresaData.email = empEmailInput.value.trim();
          empresaData.telefone = empTelefoneInput.value.trim();
          empresaData.descricao = empDescricaoInput.value.trim();
          empresaData.logo = (logoUpload && logoUpload.classList.contains('com-imagem')) ? logoPreview.src : '';
          renderEmpresaPainel();
          window.location.hash = '#empresa-painel';
        } else {
          window.location.hash = '#criar-perfil';
        }
      });
    }

    var empresaNomeExibicao = document.getElementById('empresa-nome-exibicao');
    var empresaDescricaoExibicao = document.getElementById('empresa-descricao-exibicao');
    var empresaLogoLg = document.getElementById('empresa-logo-grande');
    var empresaLogoIniciais = document.getElementById('empresa-logo-iniciais');
    var empresaLogoImg = document.getElementById('empresa-logo-img');

    function renderEmpresaPainel() {
      if (!empresaNomeExibicao) return;
      empresaNomeExibicao.textContent = empresaData.nome || 'Sua empresa';
      empresaDescricaoExibicao.textContent = empresaData.descricao || 'Complete o cadastro pra aparecer aqui.';
      empresaLogoIniciais.textContent = empresaData.nome ? iniciais(empresaData.nome) : 'EM';
      if (empresaData.logo) {
        empresaLogoImg.src = empresaData.logo;
        empresaLogoLg.classList.add('com-imagem');
      } else {
        empresaLogoLg.classList.remove('com-imagem');
      }
      renderMinhasVagas();
      renderCandidatosEmpresa();
    }

    var vagaCursosGrid = document.getElementById('vaga-grade-cursos');
    var vagaCursosErro = document.getElementById('vaga-cursos-erro');
    var vagaAttrsGrid = document.getElementById('vaga-grade-atributos');
    var criarVagaForm = document.getElementById('criar-vaga-form');
    var vagaTituloInput = document.getElementById('vaga-titulo');
    var vagaDescricaoInput = document.getElementById('vaga-descricao');
    var vagaCidadeInput = document.getElementById('vaga-cidade');
    var vagaBairroInput = document.getElementById('vaga-bairro');
    var vagaModalidadeInput = document.getElementById('vaga-modalidade');
    var vagaHorasInput = document.getElementById('vaga-horas');
    var vagaBolsaToggle = document.getElementById('bolsa-alternador');
    var vagaBolsaComCampos = document.getElementById('bolsa-com-campos');
    var vagaBolsaSemAviso = document.getElementById('bolsa-sem-aviso');
    var vagaBolsaValorInput = document.getElementById('vaga-bolsa-valor');
    var vagaBeneficiosInput = document.getElementById('vaga-beneficios');
    var vagaSupervisorNomeInput = document.getElementById('vaga-supervisor-nome');
    var vagaSupervisorCargoInput = document.getElementById('vaga-supervisor-cargo');
    var vagaSupervisorFormacaoInput = document.getElementById('vaga-supervisor-formacao');
    var criarVagaNextWrap = document.getElementById('criar-vaga-avancar-envoltorio');
    var criarVagaBtn = document.getElementById('criar-vaga-botao');
    var bolsaStatus = 'sim';

    if (vagaCursosGrid) {
      vagaCursosGrid.querySelectorAll('.chip-atributo').forEach(function (chip) {
        chip.addEventListener('click', function () {
          chip.classList.toggle('selecionado');
          validarCriarVaga();
        });
      });
    }

    if (vagaBolsaToggle) {
      vagaBolsaToggle.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          vagaBolsaToggle.querySelectorAll('button').forEach(function (b) { b.classList.remove('ativo'); });
          btn.classList.add('ativo');
          bolsaStatus = btn.dataset.bolsa;
          vagaBolsaComCampos.style.display = bolsaStatus === 'sim' ? 'block' : 'none';
          vagaBolsaSemAviso.style.display = bolsaStatus === 'nao' ? 'block' : 'none';
          validarCriarVaga();
        });
      });
    }

    function validarCriarVaga() {
      var tituloOk = vagaTituloInput.value.trim().length >= 3;
      var cursosOk = vagaCursosGrid && vagaCursosGrid.querySelectorAll('.chip-atributo.selecionado').length > 0;
      if (vagaCursosErro) vagaCursosErro.classList.toggle('visivel', false);
      var descricaoOk = vagaDescricaoInput.value.trim().length >= 10;
      var cidadeOk = vagaCidadeInput.value.trim().length >= 2;
      var bolsaOk = bolsaStatus === 'nao' || (vagaBolsaValorInput.value !== '' && parseInt(vagaBolsaValorInput.value, 10) >= 0);
      var supervisorOk = vagaSupervisorNomeInput.value.trim().length >= 3 &&
        vagaSupervisorCargoInput.value.trim().length >= 2 &&
        vagaSupervisorFormacaoInput.value.trim().length >= 3;

      var tudoOk = tituloOk && cursosOk && descricaoOk && cidadeOk && bolsaOk && supervisorOk;
      criarVagaNextWrap.classList.toggle('visivel', tudoOk);
      criarVagaBtn.disabled = !tudoOk;
      return tudoOk;
    }

    if (vagaAttrsGrid) {
      vagaAttrsGrid.querySelectorAll('.chip-atributo').forEach(function (chip) {
        chip.addEventListener('click', function () {
          chip.classList.toggle('selecionado');
        });
      });
    }

    [vagaTituloInput, vagaDescricaoInput, vagaCidadeInput, vagaBolsaValorInput, vagaSupervisorNomeInput, vagaSupervisorCargoInput, vagaSupervisorFormacaoInput].forEach(function (input) {
      if (input) input.addEventListener('input', validarCriarVaga);
    });

    if (criarVagaForm) {
      criarVagaForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validarCriarVaga()) return;

        var cursosEscolhidos = Array.prototype.map.call(
          vagaCursosGrid.querySelectorAll('.chip-atributo.selecionado'),
          function (chip) { return chip.dataset.curso; }
        );

        var atributosChaves = vagaAttrsGrid ? Array.prototype.map.call(
          vagaAttrsGrid.querySelectorAll('.chip-atributo.selecionado'),
          function (chip) { return chip.dataset.attr; }
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
          atributos: atributosChaves.map(function (a) { return ATTR_LABELS[a] || a; })
        });

        renderMinhasVagas();

        criarVagaForm.reset();
        vagaCursosGrid.querySelectorAll('.chip-atributo.selecionado').forEach(function (chip) { chip.classList.remove('selecionado'); });
        if (vagaAttrsGrid) vagaAttrsGrid.querySelectorAll('.chip-atributo.selecionado').forEach(function (chip) { chip.classList.remove('selecionado'); });
        bolsaStatus = 'sim';
        vagaBolsaToggle.querySelectorAll('button').forEach(function (b) { b.classList.toggle('ativo', b.dataset.bolsa === 'sim'); });
        vagaBolsaComCampos.style.display = 'block';
        vagaBolsaSemAviso.style.display = 'none';
        validarCriarVaga();
        var abaMinhasVagas = document.querySelector('.botao-aba[data-tab="minhas-vagas"]');
        if (abaMinhasVagas) abaMinhasVagas.click();
      });
    }

    function vagaCriadaItemHTML(v) {
      var chipsAtributos = v.atributos.map(function (label) {
        return '<span class="etiqueta-atributo">' + escapeHtml(label) + '</span>';
      }).join('');
      var cursosTexto = v.cursosAceitos.join(', ');
      var bolsaTexto = v.temBolsa
        ? 'Bolsa R$ ' + escapeHtml(v.bolsaValor) + (v.beneficios ? ' + ' + escapeHtml(v.beneficios) : '')
        : 'Estágio sem bolsa conforme art. 12 da Lei 11.788/08';
      return '' +
        '<div class="vaga-criada-item">' +
          '<div class="candidato-cabecalho">' +
            '<h3>' + escapeHtml(v.titulo) + '</h3>' +
            '<span class="selo-status aceito">' + escapeHtml(v.status) + '</span>' +
          '</div>' +
          '<p class="vaga-criada-descricao">' + escapeHtml(v.descricao) + '</p>' +
          '<div class="vaga-tags">' +
            '<span class="etiqueta">' + escapeHtml(v.cidade) + (v.bairro ? ' — ' + escapeHtml(v.bairro) : '') + '</span>' +
            '<span class="etiqueta etiqueta-sol">' + escapeHtml(v.modalidade) + '</span>' +
            '<span class="etiqueta etiqueta-sol">' + escapeHtml(v.horas) + 'h semanais</span>' +
            '<span class="etiqueta etiqueta-sol">' + bolsaTexto + '</span>' +
          '</div>' +
          '<p class="curriculo-meta" style="margin-top:10px;">Cursos aceitos: ' + escapeHtml(cursosTexto) + '</p>' +
          '<p class="curriculo-meta">Supervisor: ' + escapeHtml(v.supervisorNome) + ' — ' + escapeHtml(v.supervisorCargo) + ' (' + escapeHtml(v.supervisorFormacao) + ')</p>' +
          (chipsAtributos ? '<div class="requisitos-atributos"><span class="requisitos-atributos-rotulo">Requisitos técnicos:</span>' + chipsAtributos + '</div>' : '') +
          '<p class="campo-dica" style="margin-top:12px;">Esta oportunidade é de estágio conforme Lei 11.788/08. A contratação depende de assinatura de Termo de Compromisso de Estágio (TCE) entre aluno, empresa e instituição de ensino, e de Seguro Contra Acidentes Pessoais pago pela empresa. O OxenteVagas não é contratante.</p>' +
          '<div class="vaga-criada-rodape">' +
            '<button type="button" class="botao botao-contorno botao-pequeno" data-remove-vaga-criada="' + v.id + '">Remover vaga</button>' +
          '</div>' +
        '</div>';
    }

    var minhasVagasLista = document.getElementById('minhas-vagas-lista');

    function renderMinhasVagas() {
      if (!minhasVagasLista) return;
      if (!vagasCriadasPelaEmpresa.length) {
        minhasVagasLista.innerHTML = '<p class="estado-vazio">Você ainda não publicou nenhuma vaga. Use a aba "Criar vaga" pra publicar a primeira.</p>';
        return;
      }
      minhasVagasLista.innerHTML = vagasCriadasPelaEmpresa.map(vagaCriadaItemHTML).join('');
    }

    if (minhasVagasLista) {
      minhasVagasLista.addEventListener('click', function (e) {
        var botaoRemover = e.target.closest('[data-remove-vaga-criada]');
        if (botaoRemover) {
          var id = botaoRemover.getAttribute('data-remove-vaga-criada');
          vagasCriadasPelaEmpresa = vagasCriadasPelaEmpresa.filter(function (v) { return v.id !== id; });
          renderMinhasVagas();
        }
      });
    }

    var candidatosEmpresaLista = document.getElementById('candidatos-empresa-lista');

    function ultimosDigitos(valor, n) {
      var d = (valor || '').replace(/\D/g, '');
      return d.slice(-n);
    }

    function candidatoItemHTML(c) {
      var descricaoCv = c.tipo === 'pdf'
        ? 'Currículo em PDF: <strong>' + escapeHtml(c.nomeArquivo) + '</strong> · ' + c.tamanho + ' KB'
        : escapeHtml(c.conteudo);

      var matchTexto = (c.matchPct !== null && c.matchPct !== undefined && !isNaN(c.matchPct))
        ? c.matchPct + '% de compatibilidade'
        : 'Compatibilidade não calculada';

      var aprovado = c.status === 'aceito';

      var cpfTexto = aprovado
        ? escapeHtml(c.candidatoCpf || 'não informado')
        : 'CPF terminado em ' + (ultimosDigitos(c.candidatoCpf, 4) || '••••');
      var telefoneTexto = aprovado
        ? escapeHtml(c.candidatoTelefone || 'não informado')
        : 'oculto até a aprovação';

      var mensagemBloco = c.mensagem
        ? '<div class="candidato-cv" style="margin-top:10px;"><strong>Mensagem de apresentação:</strong><br>' + escapeHtml(c.mensagem) + '</div>'
        : '';

      var tceAviso = aprovado
        ? '<div class="tce-alerta">Para efetivar, solicite o <strong>Termo de Compromisso de Estágio (TCE)</strong> à instituição do estudante: <strong>' + escapeHtml(c.candidatoInstituicao) + '</strong>. Sem a assinatura da faculdade, não há estágio válido.<br><button type="button" class="botao botao-contorno botao-pequeno" style="margin-top:8px;" data-abrir-central="' + c.id + '">Abrir central de formalização</button></div>'
        : '';

      var acoes = c.status === 'pendente'
        ? '<div class="candidato-acoes">' +
            '<button type="button" class="botao botao-contorno botao-pequeno" data-rejeitar-candidato="' + c.id + '">Rejeitar</button>' +
            '<button type="button" class="botao botao-sol botao-pequeno" data-aceitar-candidato="' + c.id + '">Aceitar</button>' +
          '</div>'
        : '';

      return '' +
        '<div class="candidato-item">' +
          '<div class="candidato-cabecalho">' +
            '<div>' +
              '<h3>' + escapeHtml(c.candidatoNome) + (c.candidatoIdade ? ' · ' + escapeHtml(String(c.candidatoIdade)) + ' anos' : '') + '</h3>' +
              '<p>Candidatou-se pra: ' + escapeHtml(c.vagaTitulo) + ' — ' + escapeHtml(c.vagaEmpresa) + '</p>' +
              '<p>' + (c.candidatoCurso ? escapeHtml(c.candidatoCurso) + ' · ' : '') + escapeHtml(c.candidatoInstituicao) + '</p>' +
              '<p>' + cpfTexto + ' · Telefone: ' + telefoneTexto + '</p>' +
            '</div>' +
            '<span class="selo-compatibilidade ' + (c.matchPct === 100 ? '' : 'compatibilidade-parcial') + '">' + matchTexto + '</span>' +
          '</div>' +
          '<div class="candidato-cv">' + descricaoCv + '</div>' +
          mensagemBloco +
          '<div class="curriculo-acoes" style="margin-top:12px;">' +
            '<span class="selo-status ' + c.status + '">' + STATUS_LABEL[c.status] + '</span>' +
          '</div>' +
          acoes +
          tceAviso +
        '</div>';
    }

    function renderCandidatosEmpresa() {
      if (!candidatosEmpresaLista) return;
      if (!candidaturas.length) {
        candidatosEmpresaLista.innerHTML = '<p class="estado-vazio">Nenhuma candidatura recebida ainda.</p>';
        return;
      }
      candidatosEmpresaLista.innerHTML = candidaturas.map(candidatoItemHTML).join('');
    }

    var tceModal = document.getElementById('tce-modal');
    var tceModalClose = document.getElementById('tce-modal-fechar');
    var tceModalNome = document.getElementById('tce-modal-nome');
    var tceModalInstituicao = document.getElementById('tce-modal-instituicao');
    var tceAnexoTceInput = document.getElementById('tce-anexo-tce-entrada');
    var tceAnexoSeguroInput = document.getElementById('tce-anexo-seguro-entrada');
    var tceAnexosStatus = document.getElementById('tce-anexos-status');
    var tceChatMensagens = document.getElementById('tce-chat-mensagens');
    var tceChatTexto = document.getElementById('tce-chat-texto');
    var tceChatEnviarBtn = document.getElementById('tce-chat-enviar-botao');
    var tceBaixarMinutaBtn = document.getElementById('tce-baixar-minuta-botao');
    var centralFormalizacaoId = null;
    var centralFormalizacaoAutor = 'empresa';

    function candidaturaAtualCentral() {
      return candidaturas.find(function (c) { return c.id === centralFormalizacaoId; });
    }

    function renderCentralFormalizacao() {
      var c = candidaturaAtualCentral();
      if (!c) return;

      tceModalNome.textContent = c.candidatoNome;
      tceModalInstituicao.textContent = c.candidatoInstituicao;

      var tceOk = !!c.tceAnexo;
      var seguroOk = !!c.seguroAnexo;
      tceAnexosStatus.innerHTML =
        (tceOk ? '✅ TCE anexado: ' + escapeHtml(c.tceAnexo) : '⏳ TCE ainda não anexado') + ' · ' +
        (seguroOk ? '✅ Seguro anexado: ' + escapeHtml(c.seguroAnexo) : '⏳ Seguro ainda não anexado');

      if (!c.chatMensagens || !c.chatMensagens.length) {
        tceChatMensagens.innerHTML = '<p class="tce-chat-vazio">Nenhuma mensagem ainda. Use este espaço só pra tratar de TCE, seguro e data de início.</p>';
      } else {
        tceChatMensagens.innerHTML = c.chatMensagens.map(function (m) {
          return '<div class="tce-msg ' + m.autor + '"><span class="tce-msg-autor">' + (m.autor === 'empresa' ? 'Empresa' : 'Estudante') + ' · ' + m.hora + '</span>' + escapeHtml(m.texto) + '</div>';
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
      tceModal.classList.add('aberto');
    }

    function fecharCentralFormalizacao() {
      if (tceModal) tceModal.classList.remove('aberto');
    }

    if (tceModalClose) tceModalClose.addEventListener('click', fecharCentralFormalizacao);
    if (tceModal) {
      tceModal.addEventListener('click', function (e) {
        if (e.target === tceModal) fecharCentralFormalizacao();
      });
    }

    if (tceAnexoTceInput) {
      tceAnexoTceInput.addEventListener('change', function () {
        var c = candidaturaAtualCentral();
        var file = tceAnexoTceInput.files && tceAnexoTceInput.files[0];
        if (!c || !file) return;
        c.tceAnexo = file.name;
        renderCentralFormalizacao();
        renderCandidatosEmpresa();
        renderCandidaturas();
      });
    }
    if (tceAnexoSeguroInput) {
      tceAnexoSeguroInput.addEventListener('change', function () {
        var c = candidaturaAtualCentral();
        var file = tceAnexoSeguroInput.files && tceAnexoSeguroInput.files[0];
        if (!c || !file) return;
        c.seguroAnexo = file.name;
        renderCentralFormalizacao();
      });
    }

    function contemDadoPessoalSensivel(texto) {
      var pareceTelefone = /\d{4,5}[\s.-]?\d{4}/.test(texto);
      var pareceEmail = /\S+@\S+\.\S+/.test(texto);
      return pareceTelefone || pareceEmail;
    }

    function enviarMensagemChat() {
      var c = candidaturaAtualCentral();
      var texto = tceChatTexto.value.trim();
      if (!c || !texto) return;

      if (!c.tceAnexo && contemDadoPessoalSensivel(texto)) {
        tceChatTexto.value = '';
        var aviso = document.getElementById('tce-chat-aviso');
        aviso.textContent = 'Mensagem bloqueada: nada de telefone ou e-mail pessoal antes de anexar o TCE.';
        return;
      }

      if (!c.chatMensagens) c.chatMensagens = [];
      var agora = new Date();
      var hora = String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0');
      c.chatMensagens.push({ autor: centralFormalizacaoAutor, texto: texto, hora: hora });
      tceChatTexto.value = '';
      renderCentralFormalizacao();
    }

    if (tceChatEnviarBtn) tceChatEnviarBtn.addEventListener('click', enviarMensagemChat);
    if (tceChatTexto) {
      tceChatTexto.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); enviarMensagemChat(); }
      });
    }

    if (tceBaixarMinutaBtn) {
      tceBaixarMinutaBtn.addEventListener('click', function () {
        var c = candidaturaAtualCentral();
        if (!c) return;
        var janela = window.open('', '_blank');
        if (!janela) return;
        janela.document.write(
          '<html><head><title>Minuta de dados para TCE</title>' +
          '<style>body{font-family:Arial,sans-serif;padding:40px;color:#222;line-height:1.6;} h1{font-size:1.3rem;} table{border-collapse:collapse;width:100%;margin-top:16px;} td{padding:8px 10px;border:1px solid #ccc;} td:first-child{font-weight:bold;width:220px;background:#f5f5f5;}</style>' +
          '</head><body>' +
          '<h1>Minuta de dados para Termo de Compromisso de Estágio (TCE)</h1>' +
          '<p>Documento gerado automaticamente pelo OxenteVagas apenas como apoio. Não substitui o TCE oficial, que deve ser assinado pelo estudante, pela empresa e pela instituição de ensino.</p>' +
          '<table>' +
            '<tr><td>Estudante</td><td>' + escapeHtml(c.candidatoNome) + '</td></tr>' +
            '<tr><td>Instituição de ensino</td><td>' + escapeHtml(c.candidatoInstituicao) + '</td></tr>' +
            '<tr><td>Curso</td><td>' + escapeHtml(c.candidatoCurso || '-') + '</td></tr>' +
            '<tr><td>CPF do estudante</td><td>' + escapeHtml(c.candidatoCpf || '-') + '</td></tr>' +
            '<tr><td>Vaga</td><td>' + escapeHtml(c.vagaTitulo) + '</td></tr>' +
            '<tr><td>Empresa concedente</td><td>' + escapeHtml(c.vagaEmpresa) + '</td></tr>' +
            '<tr><td>Data de geração</td><td>' + new Date().toLocaleDateString('pt-BR') + '</td></tr>' +
          '</table>' +
          '<script>window.onload = function(){ window.print(); };</' + 'script>' +
          '</body></html>'
        );
        janela.document.close();
      });
    }

    if (candidatosEmpresaLista) {
      candidatosEmpresaLista.addEventListener('click', function (e) {
        var botaoAceitar = e.target.closest('[data-aceitar-candidato]');
        var botaoRejeitar = e.target.closest('[data-rejeitar-candidato]');
        var botaoAbrirCentral = e.target.closest('[data-abrir-central]');

        if (botaoAbrirCentral) {
          abrirCentralFormalizacao(botaoAbrirCentral.getAttribute('data-abrir-central'), 'empresa');
          return;
        }

        var id = botaoAceitar ? botaoAceitar.getAttribute('data-aceitar-candidato') : (botaoRejeitar ? botaoRejeitar.getAttribute('data-rejeitar-candidato') : null);
        if (!id) return;
        var candidatura = candidaturas.find(function (c) { return c.id === id; });
        if (!candidatura) return;
        candidatura.status = botaoAceitar ? 'aceito' : 'rejeitado';
        if (botaoAceitar && !candidatura.chatMensagens) candidatura.chatMensagens = [];
        renderCandidatosEmpresa();
        renderCandidaturas();

        if (botaoAceitar) abrirCentralFormalizacao(candidatura.id, 'empresa');
      });
    }

    if (candidaturasList) {
      candidaturasList.addEventListener('click', function (e) {
        var botaoAbrirCentral = e.target.closest('[data-abrir-central]');
        if (botaoAbrirCentral) {
          abrirCentralFormalizacao(botaoAbrirCentral.getAttribute('data-abrir-central'), 'estudante');
        }
      });
    }
  });
})();