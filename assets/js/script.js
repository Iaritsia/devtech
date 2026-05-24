/* ============================================================
   1. CRONÔMETRO REGRESSIVO
   Aparece no cabeçalho de index.html e eventos.html.
   🔧 ALTERE A DATA do evento na linha indicada abaixo.
   ============================================================ */
function iniciarCronometro() {
  const contador = document.getElementById("contador");
  if (!contador) return; /* Se não existe nessa página, para aqui */
 
  /* 🗓️ ALTERE AQUI: data e hora do evento (ano, mês-1, dia, hora, min, seg)
     Mês começa em 0: janeiro=0, julho=6, dezembro=11             */
  const dataEvento = new Date(2026, 6, 23, 9, 0, 0);
 
  function atualizar() {
    const agora = new Date();
    const diferenca = dataEvento - agora;
 
    if (diferenca <= 0) {
      contador.innerHTML = "🎉 O evento começou!";
      return;
    }
 
    const dias     = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas    = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
    const minutos  = Math.floor((diferenca / (1000 * 60)) % 60);
    const segundos = Math.floor((diferenca / 1000) % 60);
 
    /* Pad: coloca zero na frente quando o número tem só 1 dígito (ex: 09) */
    const pad = n => String(n).padStart(2, "0");
 
    contador.innerHTML =
      `⏳ Faltam: ${dias}d ${pad(horas)}h ${pad(minutos)}m ${pad(segundos)}s`;
  }
 
  atualizar();
  setInterval(atualizar, 1000);
}
 
 
/* ============================================================
   2. TOGGLE DO CAMPO "OUTROS" (cadastro.html)
   Habilita o campo de texto quando a caixa "Outros" é marcada.
   Esta função é chamada pelo onclick no HTML, não precisa alterar.
   ============================================================ */
function toggleOutros() {
  const checkbox = document.getElementById("outrosCheck");
  const campo    = document.getElementById("campoOutros");
  if (!checkbox || !campo) return;
 
  if (checkbox.checked) {
    campo.disabled = false;
    campo.focus();
  } else {
    campo.disabled = true;
    campo.value = "";
  }
}
 
 
/* ============================================================
   3. LOGIN (login.html)
   Verifica usuário e senha e redireciona para o relatório.
   ⚠️ A senha fica visível no código-fonte — ok para projeto
   escolar. Em produção real, use autenticação no servidor.
   ============================================================ */
function iniciarLogin() {
  const form = document.getElementById("formLogin");
  if (!form) return; /* Só roda na página de login */
 
  /* 🔑 ALTERE AQUI: usuário e senha do administrador */
  const USUARIO_CORRETO = "Iaritsia";
  const SENHA_CORRETA   = "ia2603";
 
  form.addEventListener("submit", function (e) {
    e.preventDefault();
 
    const usuario      = document.getElementById("loginUsuario").value.trim();
    const senha        = document.getElementById("loginSenha").value;
    const mensagemErro = document.getElementById("mensagemErro");
 
    if (usuario === USUARIO_CORRETO && senha === SENHA_CORRETA) {
      /* Login correto: salva marcação na sessão e vai para o relatório */
      sessionStorage.setItem("logado", "true");
      window.location.href = "relatorio.html";
    } else {
      /* Login errado: mostra a div de erro */
      mensagemErro.style.display = "block";
      mensagemErro.innerText = "❌ Usuário ou senha incorretos. Tente novamente.";
    }
  });
}
 
 
/* ============================================================
   4. PROTEÇÃO DO RELATÓRIO (relatorio.html)
   Se alguém tentar entrar direto pela URL sem ter logado,
   é redirecionado de volta para o login.
   ============================================================ */
function verificarAcesso() {
  const naTelaRelatorio = document.getElementById("tabelaInscritos");
  if (!naTelaRelatorio) return;
 
  if (sessionStorage.getItem("logado") !== "true") {
    alert("Você precisa fazer login para acessar esta página.");
    window.location.href = "login.html";
  }
}
 
 
/* ============================================================
   5. CARREGAR INSCRITOS NA TABELA (relatorio.html)
   Busca todos os inscritos no Supabase e monta as linhas
   da tabela com os botões de editar e excluir.
   ============================================================ */
async function carregarInscritos() {
  const tabela = document.getElementById("tabelaInscritos");
  if (!tabela) return;
 
  /* Busca os dados ordenados do mais recente para o mais antigo */
  const { data, error } = await supabaseClient
    .from("Cadastro")
    .select("*")
    .order("created_at", { ascending: false });
 
  /* Esconde o aviso "Carregando..." após receber resposta */
  const aviso = document.getElementById("mensagemCarregando");
  if (aviso) aviso.style.display = "none";
 
  if (error) {
    alert("Erro ao carregar inscritos: " + error.message);
    return;
  }
 
  tabela.innerHTML = "";
 
  if (data.length === 0) {
    tabela.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:#94a3b8;">
      Nenhum inscrito encontrado.</td></tr>`;
    return;
  }
 
  data.forEach(function (inscrito) {
    tabela.appendChild(criarLinha(inscrito));
  });
}
 
 
/* ============================================================
   6. CRIAR LINHA DA TABELA
   Monta o HTML de uma linha com campos editáveis e botões.
   Cada campo tem um <span> (texto normal) e um <input>
   (campo de edição) que alternamos entre si.
   ============================================================ */
function criarLinha(inscrito) {
  const tr = document.createElement("tr");
  tr.setAttribute("data-id", inscrito.id);
 
  /* Formata a data de inscrição para dd/mm/aaaa */
  const dataFormatada = inscrito.created_at
    ? new Date(inscrito.created_at).toLocaleDateString("pt-BR")
    : "—";
 
  /* Protege contra null/undefined com ?? "" */
  const n = (v) => v ?? "";
 
  tr.innerHTML = `
    <td>
      <span class="texto-normal">${n(inscrito.nome)}</span>
      <input class="campo-edicao" type="text" value="${n(inscrito.nome)}" style="display:none">
    </td>
    <td>
      <span class="texto-normal">${n(inscrito.email)}</span>
      <input class="campo-edicao" type="email" value="${n(inscrito.email)}" style="display:none">
    </td>
    <td>
      <span class="texto-normal">${n(inscrito.telefone) || "—"}</span>
      <input class="campo-edicao" type="tel" value="${n(inscrito.telefone)}" style="display:none">
    </td>
    <td>
      <span class="texto-normal">${n(inscrito.atuacao) || "—"}</span>
      <input class="campo-edicao" type="text" value="${n(inscrito.atuacao)}" style="display:none">
    </td>
    <td>
      <span class="texto-normal">${n(inscrito.interesse) || "—"}</span>
      <input class="campo-edicao" type="text" value="${n(inscrito.interesse)}" style="display:none">
    </td>
    <td>${dataFormatada}</td>
    <td class="coluna-acoes">
      <div class="botoes-normais">
        <button class="btn-editar" onclick="ativarEdicao(this)">✏️ Editar</button>
        <button class="btn-excluir" onclick="excluirInscrito(this)">🗑️ Excluir</button>
      </div>
      <div class="botoes-edicao" style="display:none">
        <button class="btn-salvar" onclick="salvarEdicao(this)">💾 Salvar</button>
        <button class="btn-cancelar" onclick="cancelarEdicao(this)">✖ Cancelar</button>
      </div>
    </td>
  `;
 
  return tr;
}
 
 
/* ============================================================
   7. ATIVAR EDIÇÃO
   Esconde os textos e mostra os inputs para editar.
   ============================================================ */
function ativarEdicao(botao) {
  const linha = botao.closest("tr");
 
  linha.querySelectorAll(".texto-normal").forEach(el => el.style.display = "none");
  linha.querySelectorAll(".campo-edicao").forEach(el => el.style.display = "inline-block");
 
  linha.querySelector(".botoes-normais").style.display = "none";
  linha.querySelector(".botoes-edicao").style.display  = "flex";
}
 
 
/* ============================================================
   8. CANCELAR EDIÇÃO
   Volta a mostrar os textos e esconde os inputs.
   Não salva nada no banco.
   ============================================================ */
function cancelarEdicao(botao) {
  const linha = botao.closest("tr");
 
  linha.querySelectorAll(".texto-normal").forEach(el => el.style.display = "inline");
  linha.querySelectorAll(".campo-edicao").forEach(el => el.style.display = "none");
 
  linha.querySelector(".botoes-normais").style.display = "flex";
  linha.querySelector(".botoes-edicao").style.display  = "none";
}
 
 
/* ============================================================
   9. SALVAR EDIÇÃO
   Pega os valores dos inputs, envia para o Supabase
   e atualiza os textos visíveis na linha.
   ============================================================ */
async function salvarEdicao(botao) {
  const linha  = botao.closest("tr");
  const id     = linha.getAttribute("data-id");
  const inputs = linha.querySelectorAll("input.campo-edicao");
 
  const novosDados = {
    nome:      inputs[0].value,
    email:     inputs[1].value,
    telefone:  inputs[2].value,
    atuacao:   inputs[3].value,
    interesse: inputs[4].value
  };
 
  const { error } = await supabaseClient
    .from("Cadastro")
    .update(novosDados)
    .eq("id", id);
 
  if (error) {
    alert("Erro ao salvar: " + error.message);
    return;
  }
 
  /* Atualiza os textos visíveis com os novos valores */
  const textos = linha.querySelectorAll(".texto-normal");
  textos[0].innerText = novosDados.nome      || "—";
  textos[1].innerText = novosDados.email     || "—";
  textos[2].innerText = novosDados.telefone  || "—";
  textos[3].innerText = novosDados.atuacao   || "—";
  textos[4].innerText = novosDados.interesse || "—";
 
  cancelarEdicao(botao); /* Sai do modo edição */
  alert("✅ Inscrito atualizado com sucesso!");
}
 
 
/* ============================================================
   10. EXCLUIR INSCRITO
   Pede confirmação, depois remove do banco e da tabela.
   ============================================================ */
async function excluirInscrito(botao) {
  const linha = botao.closest("tr");
  const id    = linha.getAttribute("data-id");
  const nome  = linha.querySelector(".texto-normal").innerText;
 
  const confirmar = confirm(`Tem certeza que deseja excluir "${nome}"?\nEsta ação não pode ser desfeita.`);
  if (!confirmar) return;
 
  const { error } = await supabaseClient
    .from("Cadastro")
    .delete()
    .eq("id", id);
 
  if (error) {
    alert("Erro ao excluir: " + error.message);
    return;
  }
 
  linha.remove(); /* Remove a linha da tela */
  alert("🗑️ Inscrito excluído com sucesso.");
}
 
 
/* ============================================================
   11. INICIALIZAÇÃO GERAL
   Executado quando qualquer página terminar de carregar.
   Cada função verifica sozinha se está na página certa.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  iniciarCronometro();
  iniciarLogin();
  verificarAcesso();
 
  /* Carrega inscritos só se a tabela existir (relatorio.html) */
  if (document.getElementById("tabelaInscritos")) {
    carregarInscritos();
  }
});