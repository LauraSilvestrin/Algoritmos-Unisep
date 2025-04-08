// Seletores de elementos da interface
const addBtn = document.getElementById("add-btn");
const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const priorityInput = document.getElementById("priority-input");

const tableBody = document.getElementById("table-body");

const updateTaskInput = document.getElementById("update-task-input");
const updateDateInput = document.getElementById("update-date-input");
const updatePriorityInput = document.getElementById("update-priority-input");

const updateBtn = document.getElementById("update-btn");
const cancelBtn = document.getElementById("cancel-btn");

// Estado da aplicação
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentTaskId = null;

// Adiciona nova tarefa
function addTask() {
    const description = taskInput.value.trim();
    const dueDate = dateInput.value;
    const priority = priorityInput.value;

    if (description && dueDate && priority) {
        let id = 1;
        while (tasks.some(task => task.id === id)) {
            id++;
        }

        const newTask = {
            id: id,
            description: description,
            dueDate: dueDate,
            priority: priority,
            completed: false
        };

        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        dateInput.value = '';
        priorityInput.value = 'Baixa';
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
        updatePriorityInput.value = task.priority;
        currentTaskId = taskId;
        document.getElementById('update-container').style.display = 'block';
    }
    document.getElementById('update-container').scrollIntoView({ behavior: 'smooth' });
}

// Atualiza tarefa
function updateTask() {
    const description = updateTaskInput.value.trim();
    const dueDate = updateDateInput.value;
    const priority = updatePriorityInput.value;

    if (description && dueDate && priority) {
        const index = tasks.findIndex(task => task.id === currentTaskId);
        if (index !== -1) {
            tasks[index].description = description;
            tasks[index].dueDate = dueDate;
            tasks[index].priority = priority;

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
    updatePriorityInput.value = 'Baixa';
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

// Conclui tarefa
function completeTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = true;
        renderTable();
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Renderiza a tabela de tarefas
function renderTable() {
    tableBody.innerHTML = '';

    tasks.sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    tasks.forEach(task => {
        const tr = document.createElement('tr');

        const idTd = document.createElement('td');
        idTd.innerText = task.id;

        const descTd = document.createElement('td');
        descTd.innerText = task.description;

        const dateTd = document.createElement('td');
        dateTd.innerText = task.dueDate;

        const priorityTd = document.createElement('td');
        priorityTd.innerText = task.priority;

        const actionsTd = document.createElement('td');
        const actionsDiv = document.createElement('div');
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        const completeBtn = document.createElement('button');

        completeBtn.innerText = 'Concluir';
        editBtn.innerText = 'Editar';
        deleteBtn.innerText = 'Excluir';

        actionsDiv.className = 'actions';
        completeBtn.className = 'complete-btn';
        editBtn.className = 'edit-btn';
        deleteBtn.className = 'delete-btn';

        editBtn.addEventListener('click', () => showUpdateForm(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        completeBtn.addEventListener('click', () => completeTask(task.id));
        
        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        actionsTd.appendChild(actionsDiv);

        if (task.completed) {
            tr.style.opacity = '0.5';
            tr.style.textDecoration = 'line-through';
        }

        tr.appendChild(idTd);
        tr.appendChild(descTd);
        tr.appendChild(dateTd);
        tr.appendChild(priorityTd);
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