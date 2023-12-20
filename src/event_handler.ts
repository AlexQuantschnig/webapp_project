import { loadTodoTable, sortTodos } from "./index.js";
import { Todo } from "./todo.js";

export function addFormEventListener(form: HTMLFormElement){
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
}


export async function handleCheckboxChange(event: Event) {
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
        window.location.reload();
    }
}

export async function handleDeleteButtonClick(event: Event) {
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
            window.location.reload();
        }
    }
}

export async function handleSelectChange( select: HTMLSelectElement, todos: Todo[]): Promise<Todo[]>{
   select.addEventListener('change', async function (event: Event) {
        event.preventDefault();
        const select = event.target as HTMLSelectElement;
        console.log(select.value);
        todos = sortTodos(todos, select);
        await loadTodoTable(todos);   
    });
     return todos;
}