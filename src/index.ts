import { Todo } from "./todo.js";
import * as handler from "./event_handler.js";

const form = document.getElementById('addTodoForm') as HTMLFormElement;
handler.addFormEventListener(form);

let todos: Todo[];

function generateTodoHTML(todo: Todo): string {
    let dueDate;

    if (todo.dueDate == null) {
        dueDate = "";
    } else {
        dueDate = new Date(todo.dueDate).toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    }

    return `
        <ul class="list-group list-group-horizontal rounded-0 bg-transparent">
            <li class="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                <div class="form-check">
                    <input class="form-check-input me-0" type="checkbox" value="" id="checkBox${todo.idTodo}" ${todo.completed ? 'checked' : ''}  />
                </div>
            </li>
            <li class="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                <p class="lead fw-normal mb-0 text-white">${todo.title}</p>
            </li>
            <li class="list-group-item d-flex align-items-center border-0 bg-transparent">
                <p class="lead fw-normal mb-0 text-white">${dueDate}</p>
            </li>
            <li class="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                <button type="button" class="btn bg-transparent">      
                    <span class="material-symbols-outlined text-white">menu</span>
                </button>      
            </li>
            <li class="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                <button type="button" class="btn bg-transparent deleteBtn" >      
                    <span class="material-symbols-outlined text-white" id="delete${todo.idTodo}">delete</span>
                </button>
            </li> 
        </ul>
    `;
}

window.onload = async function () {

    let todos = await fetchTodos();
    const select = document.querySelector('#sort') as HTMLSelectElement;
    todos = await handler.handleSelectChange(select, todos);
    todos = sortTodos(todos, select);
    await loadTodoTable(todos);
};

async function fetchTodos():Promise<Todo[]> {
    const response = await fetch('/getTodos');
    todos = await response.json();
    return todos;
}

export function sortTodos(todos: Todo[], select: HTMLSelectElement) {

    if (select.value == "dueDate") {
        todos.sort((a, b) =>{
            if (a.dueDate == null) {
                return 1;
            }
            if (b.dueDate == null) {
                return -1;
            }
            
            return (a.dueDate > b.dueDate) ? 1 : -1;
        });
        return todos;
    }

    if (select.value == "creationDate") {
        todos.sort((a, b) => (a.creationDate > b.creationDate) ? 1 : -1);
        return todos;
    }
    return todos;
}

export async function loadTodoTable(todos: Todo[]) {

    const finishedTodos = todos.filter(todo => todo.completed);
    const unfinishedTodos = todos.filter(todo => !todo.completed);

    const div = document.querySelector('#todoDiv') as HTMLElement | null;

    if (div) {
        div.innerHTML = '';
        const todoHTML = unfinishedTodos.map(generateTodoHTML).join('');

        div.insertAdjacentHTML('beforeend', todoHTML);

        if (finishedTodos.length > 0) {
            div.insertAdjacentHTML('beforeend', '<hr class="my-4 my-hr">');
            div.insertAdjacentHTML('beforeend', '<h2 class="text-white">Finished Todo-s</h2>');
            const unfinishedTodosHTML = finishedTodos.map(generateTodoHTML).join('');
            div.insertAdjacentHTML('beforeend', unfinishedTodosHTML);
        }

        const checkboxes = document.querySelectorAll('.form-check-input');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change',handler.handleCheckboxChange);
        });

        const deleteButtons = document.querySelectorAll('.deleteBtn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', handler.handleDeleteButtonClick);
        });
    }
}