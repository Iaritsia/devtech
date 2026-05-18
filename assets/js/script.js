document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("formLogin");
        const mensagemErro = document.getElementById("mensagemErro");

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const usuario = document.getElementById("loginUsuario").value;
            const senha = document.getElementById("loginSenha").value;

            if (usuario === "Iaritsia" && senha === "ia2603") {
                window.location.href = "relatorio.html";
            } else {
                mensagemErro.style.display = "block";
                mensagemErro.innerText = "Usuário ou senha incorretos.";
            }
        });
});

if (document.getElementById("tabelaInscritos")) {
     carregarInscritos();
}
async function carregarInscritos() {

    const { data, error } = await supabaseClient

        .from("Cadastro")

        .select("*");

    console.log(data);

    console.log(error);

    if (error) {

        console.error(error);

        alert(error.message);

        return;
    }

    const tabela =
        document.getElementById("tabelaInscritos");

    if (!tabela) return;

    tabela.innerHTML = "";

    data.forEach(inscrito => {

        tabela.innerHTML += `
            <tr>
                <td>${inscrito.nome ?? ""}</td>
                <td>${inscrito.email ?? ""}</td>
                <td>${inscrito.telefone ?? ""}</td>
                <td>${inscrito.atuacao ?? ""}</td>
                <td>${inscrito.interesse ?? ""}</td>
                <td>${inscrito.data ?? ""}</td>

            </tr>
        `;

    }); 
}

const dataEvento = new Date(2026, 6, 23, 0, 0, 0);

  function atualizarContador() {
    const agora = new Date();
    const diferenca = dataEvento - agora;

    if (diferenca <= 0) {
      document.getElementById("contador").innerHTML = "O evento começou!";
      return;
    }

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
    const segundos = Math.floor((diferenca / 1000) % 60);

    document.getElementById("contador").innerHTML =
      `Faltam: ${dias} dias, ${horas}h ${minutos}m ${segundos}s`;
 }

setInterval(atualizarContador, 1000);

function toggleOutros() {
    const checkbox = document.getElementById("outrosCheck");
    const campo = document.getElementById("campoOutros");

    if (checkbox.checked) {
        campo.disabled = false;
    } else {
        campo.disabled = true;
        campo.value = "";
    }
 }
formData.get("observacoes")

