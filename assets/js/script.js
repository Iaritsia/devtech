const supabaseUrl = "https://mxadxpzrmnszzrxfgxyc.supabase.co";
const supabaseKey = "sb_publishable_vRBoSsDRe_phd-kZ0wy5Rw_4EXRkp99";

const supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);
async function carregarInscritos() {

    const { data, error } = await supabaseClient

        .from("cadastro")

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
                <td>${area_atuacao ?? ""}</td>
                <td>${inscrito.interesse ?? ""}</td>
                <td>${inscrito.data ?? ""}</td>

            </tr>
        `;

    });
 carregarInscritos();
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