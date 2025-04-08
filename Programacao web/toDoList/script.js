// Seletores de elementos da interface
const addBtn = document.getElementById("add-btn");
const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const statusInput = document.getElementById("status-input");

const tableBody = document.getElementById("table-body");

const updateTaskInput = document.getElementById("update-task-input");
const updateDateInput = document.getElementById("update-date-input");
const updateStatusInput = document.getElementById("update-status-input");

const updateBtn = document.getElementById("update-btn");
const cancelBtn = document.getElementById("cancel-btn");

// Estado da aplicação
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentTaskId = null;

// Adiciona nova tarefa
function addTask() {
    const description = taskInput.value.trim();
    const dueDate = dateInput.value;
    const status = statusInput.value;

    if (description && dueDate && status) {
        let id = 1;
        while (tasks.some(task => task.id === id)) {
            id++;
        }

        const newTask = {
            id: id,
            description: description,
            dueDate: dueDate,
            status: status
        };

        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        dateInput.value = '';
        statusInput.value = 'Fazer';
        renderTable();
    } else {
        alert("Preencha todos os campos!");
    }
}

// Mostra formulário de atualização
function showUpdateForm(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        updateTaskInput.value = task.description;
        updateDateInput.value = task.dueDate;
        updateStatusInput.value = task.status;
        currentTaskId = taskId;
        document.getElementById('update-container').style.display = 'block';
    }
    document.getElementById('update-container').scrollIntoView({ behavior: 'smooth' });

}

// Atualiza tarefa
function updateTask() {
    const description = updateTaskInput.value.trim();
    const dueDate = updateDateInput.value;
    const status = updateStatusInput.value;

    if (description && dueDate && status) {
        const index = tasks.findIndex(task => task.id === currentTaskId);
        if (index !== -1) {
            tasks[index].description = description;
            tasks[index].dueDate = dueDate;
            tasks[index].status = status;

            localStorage.setItem('tasks', JSON.stringify(tasks));
            hideUpdateForm();
            renderTable();
        }
    } else {
        alert("Preencha todos os campos!");
    }
}

// Cancela edição
function hideUpdateForm() {
    updateTaskInput.value = '';
    updateDateInput.value = '';
    updateStatusInput.value = 'Fazer';
    currentTaskId = null;
    document.getElementById('update-container').style.display = 'none';
}

// Exclui tarefa
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    hideUpdateForm();
    renderTable();
}

// Renderiza a tabela de tarefas
function renderTable() {
    tableBody.innerHTML = '';

    const sortedTasks = tasks.slice().sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // Tarefas concluidas vão para o fim
        if (a.status === "Feito" && b.status !== "Feito") return 1;
        if (a.status !== "Feito" && b.status === "Feito") return -1;

        return dateA - dateB;
    });

    sortedTasks.forEach(task => {
        const tr = document.createElement('tr');

        const idTd = document.createElement('td');
        idTd.innerText = task.id;

        const descTd = document.createElement('td');
        descTd.innerText = task.description;

        const dateTd = document.createElement('td');
        dateTd.innerText = task.dueDate;

        const statusTd = document.createElement('td');
        statusTd.innerText = task.status;

        const actionsTd = document.createElement('td');
        const actionsDiv = document.createElement('div');
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');

        actionsDiv.className = 'actions';
        editBtn.innerText = 'Editar';
        deleteBtn.innerText = 'Excluir';
        editBtn.className = 'edit-btn';
        deleteBtn.className = 'delete-btn';

        editBtn.addEventListener('click', () => showUpdateForm(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        actionsTd.appendChild(actionsDiv)
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        const today = new Date();
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (task.status !== "Feito") {
            if (daysDiff < 0) {
                tr.style.backgroundColor = '#ffcccc'; 
            } 
        } else {
            tr.style.opacity = "0.5"; // tarefa feita
        }

        tr.appendChild(idTd);
        tr.appendChild(descTd);
        tr.appendChild(dateTd);
        tr.appendChild(statusTd);
        tr.appendChild(actionsTd);

        tableBody.appendChild(tr);
    });
}

// Eventos
addBtn.addEventListener('click', addTask);
updateBtn.addEventListener('click', updateTask);
cancelBtn.addEventListener('click', hideUpdateForm);

// Inicializa
renderTable();
