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
        listar();

    });
}

function listar() {
    $.get(`${urlBase}.json`, data => {

        $("#lista").html("");

        for (const id in data) {

            const usuario = data[id];

            $("#lista").append(`
                <li class="list-group-item d-flex justify-content-between
                align-items-center bg-purple text-white mb-3">

                    <div>
                        <strong>${usuario.nome} </strong> - ${usuario.idade} anos
                    </div>
                
                    <div>
                        <button class="btn btn-sm btn-warning me-2" 
                        onclick="editar('${id}',
                        '${usuario.nome}',
                        '${usuario.idade}',
                        '${usuario.perfil}'
                        )">
                        Editar
                        </button>

                        <button class="btn btn-sm btn-danger" 
                        onclick="excluir('${id}')">
                        Excluir
                        </button>
                    </div>

                </li>
                `);
        }
    });
}

$(document).ready(() => {
    listar();
});

function editar(id, nome, idade, perfil) {
    const novoNome = prompt("Nome: ", nome);
    const novaIdade = prompt("Idade: ", idade);
    const novaPerfil = prompt("Perfil: ", perfil);

    const dados = JSON.stringify({ nome: novoNome, idade: novaIdade, perfil: novaPerfil });

    $.ajax({
        url: `${urlBase}/${id}.json`,
        method: "PUT", data: dados, success: listar
    });

    listar();
}

function excluir(id) {

    $.ajax({
        url: `${urlBase}/${id}.json`,
        method: "DELETE",
         success: listar
    });

    listar();
}