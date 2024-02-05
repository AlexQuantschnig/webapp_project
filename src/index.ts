import { Todo } from "./todo.js";
import * as handler from "./event_handler.js";

const form = document.getElementById('addTodoForm') as HTMLFormElement;
handler.addFormEventListener(form);

let todos: Todo[];

function generateTodoHTML(todo: Todo): string {
    const dueDateDisplay = formatDate(todo.dueDate);

    var overdue = false;

    if (todo.dueDate != null) {
        const now: number = Date.now();
        const todoDate: Date = new Date(todo.dueDate);
        overdue = todoDate.getTime() < now;
    }

    const textColorClass = overdue ? 'text-danger' : 'text-white';
    const isCompleted = todo.completed ? 'text-decoration-line-through text-primary' : '';

    return `
        <ul class="list-group list-group-horizontal rounded-0 bg-transparent ${isCompleted}">
            <li class="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
                <div class="form-check">
                    <input class="form-check-input me-0" type="checkbox" value="" id="checkBox${todo.idTodo}" ${todo.completed ? 'checked' : ''}  />
                </div>
            </li>
            <li class="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
                <p class="lead fw-normal mb-0 ${textColorClass} ">${todo.title}</p>
            </li>
            <li class="list-group-item d-flex align-items-center border-0 bg-transparent">
                <p class="lead fw-normal mb-0 ${textColorClass}">${dueDateDisplay}</p>
            </li>
            <li class="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
          
            <button type="button" class="btn bg-transparent menuBtn" id="menu">      
                    <span class="material-symbols-outlined text-white" id="menu${todo.idTodo}">menu</span>
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

async function fetchTodos(): Promise<Todo[]> {
    const response = await fetch('/getTodos');
    todos = await response.json();
    return todos;
}

export function sortTodos(todos: Todo[], select: HTMLSelectElement) {

    if (select.value == "dueDate") {
        todos.sort((a, b) => {
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
            checkbox.addEventListener('change', handler.handleCheckboxChange);
        });

        const deleteButtons = document.querySelectorAll('.deleteBtn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', handler.handleDeleteButtonClick);
        });

        const menuButtons = document.querySelectorAll(".menuBtn");
        menuButtons.forEach(button => {
            button.addEventListener('click', function (event: Event) {
                handler.handleMenuButtonClick(event);
            });
        });
    }
}


document.addEventListener('DOMContentLoaded', function () {
    let input = document.getElementById("dueDate") as HTMLInputElement;
    let now = new Date();
    let localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    input.min = localDateTime;
});

function formatDate(date: string | undefined): string {

    if (date == null) {
        return "";
    }

    return new Date(date).toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
}

function createModal(todo: Todo) {

    const dueDate = formatDate(todo.dueDate);
    const creationDate = formatDate(todo.creationDate);

    const modalHTML = `
        <div class="modal" id="modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content"> 
                    <form method="post" action="/updateDesctiption/${todo.idTodo}" id="descriptionForm">
                     <div class="modal-header text-bg-secondary">  
                        
                     <h5 class="modal-title">${todo.title}</h5>
                    <button type="button" class="btn-close closeModal" aria-label="Close"></button>
                    </div>
                        <div class="modal-body text-bg-dark">
                        <table class="table table-dark table-striped">
                            <tbody>
                                <tr>
                                    <th scope="row">Description</th>
                                    <td>
                              
                                    <input name="description" id="description" class="form-control form-control-sl me-3"
                                    type="text" placeholder="${todo.description == null ? "Add a description ..." : todo.description}">
                                    </td>
                                  
                                </tr>
                                <tr>
                                    <th scope="row">Creation Date</th>
                                    <td>${creationDate}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Due Date</th>
                                    <td>${dueDate}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                         <div class="modal-footer text-bg-secondary">
                        <button type="button" class="btn btn-danger closeModal" >Close</button>
                         <button type="submit" class="btn btn-primary">Save changes</button>
                    </div>
                    </form>
                </div>
             </div>
          </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const descriptionForm = document.getElementById('descriptionForm') as HTMLFormElement;
    handler.addDescription(descriptionForm, todo.idTodo!);
}

export function showModal(todo: Todo) {

    const oldModal = document.getElementById('modal');
    if (oldModal) {
        oldModal.remove();
    }

    createModal(todo);

    const modal = document.getElementById('modal') as HTMLElement;
    const closeModalBtns = document.querySelectorAll('.closeModal');

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });


    modal.style.display = 'block';

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}