const urlBase = "https://lading-page-9621b-default-rtdb.firebaseio.com/perfil"

function adicionar() {

    const nome = $("#nome").val();
    const idade = $("#idade").val();
    const perfil = $("#perfil").val();

    console.log(`Adicionado: ${nome}, ${idade}, ${perfil}`);

    const dados = JSON.stringify({ nome, idade, perfil });

    $.post(`${urlBase}.json`, dados, () => {

        $("#nome").val("");
        $("#idade").val("");
        $("#perfil").val("");

        alert("Dados inseridos com sucesso!");

    });
}