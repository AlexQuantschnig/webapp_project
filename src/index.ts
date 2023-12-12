const form = document.getElementById('addTodoForm') as HTMLFormElement;

form.addEventListener('submit', async function (event: Event) {

    event.preventDefault();

    const todoTitle = (this.elements.namedItem('todoTitle') as HTMLInputElement).value;
    const dueDate = (this.elements.namedItem('dueDate') as HTMLInputElement).value;

    const response = await fetch('/addTodo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            todoTitle: todoTitle,
            dueDate: dueDate,
        })
    });

    const data = await response.json();

    if (data.error) {
        console.error(data.error);
        window.alert("Something went wrong while adding a todo!");
    } else {
        window.location.reload();
        console.log("Success! added" + data.message);
        window.alert("Success! added " + data.message);
    }
});

async function handleCheckboxChange(event: Event) {
    event.preventDefault();
    const checkbox = event.target as HTMLInputElement;
    const id: number = Number(checkbox.id.replace('checkBox', ''));

    console.log("checkbox id: ", id);

    const response = await fetch(`/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            completed: checkbox.checked
        })
    });
    const data = response.status;

    if (data != 200) {
        console.error(data);
        window.alert("Something went wrong while updating the todo!");
    } else {
        //  window.alert("Success! updated " + data.message);
        window.location.reload();
    }
}

async function handleDeleteButtonClick(event: Event) {
    event.preventDefault();

    if (window.confirm("Are you sure you want to delete this todo?")) {
        const button = event.target as HTMLInputElement;
        const id: number = Number(button.id.replace('delete', ''));

        console.log("delete id: ", id);

        const response = await fetch(`/deleteTodo/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = response.status;

        if (data != 200) {
            console.error(data);
            window.alert("Something went wrong while deleting the todo!");
        } else {
            //  window.alert("Success! updated " + data.message);
            window.location.reload();
        }
    }
}


let todos: any[];

function generateTodoHTML(todo: any): string {

    if (todo.dueDate == null) {
        todo.dueDate = "";
    } else {
        todo.dueDate = new Date(todo.dueDate).toLocaleString(undefined, {
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
                <p class="lead fw-normal mb-0 text-white">${todo.dueDate}</p>
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
    const response = await fetch('/getTodos');
    todos = await response.json();

    const select = document.getElementById('sort') as HTMLSelectElement;

    const finishedTodos = todos.filter(todo => todo.completed);
    const unfinishedTodos = todos.filter(todo => !todo.completed);

    if (select.value == "1") {
        finishedTodos.sort((a, b) => {
            return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
        });
        unfinishedTodos.sort((a, b) => {
            return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
        });
    }

    if (select.value == "2") {
        finishedTodos.sort((a, b) => {
            return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
        });
        unfinishedTodos.sort((a, b) => {
            return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
        });
    }


    const div = document.querySelector('#todoList') as HTMLElement | null;

    if (div) {
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
            checkbox.addEventListener('change', handleCheckboxChange);
        });

        const deleteButtons = document.querySelectorAll('.deleteBtn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', handleDeleteButtonClick);
        });
    }
};

