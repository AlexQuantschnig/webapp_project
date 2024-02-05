import { loadTodoTable, showModal, sortTodos } from "./index.js";
import { Todo } from "./todo.js";

/**
 * Adds a form event listener to the specified HTML form element.
 * When the form is submitted, it prevents the default form submission behavior,
 * sends a POST request to '/addTodo' with the form data as JSON,
 * and handles the response accordingly.
 * If the response contains an error, it logs the error and displays an alert.
 * If the response is successful, it reloads the page, logs a success message, and displays an alert.
 * 
 * @param form - The HTML form element to attach the event listener to.
 */
export function addFormEventListener(form: HTMLFormElement) {
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

/**
 * Adds a description to a todo item.
 * 
 * @param form - The HTML form element containing the description input field.
 * @param todoId - The ID of the todo item.
 */
export function addDescription(form: HTMLFormElement, todoId: number) {
    form.addEventListener('submit', async function (event: Event) {
        event.preventDefault();
        const description = (this.elements.namedItem('description') as HTMLInputElement).value;

        const response = await fetch(`/updateDescription/${todoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: description,
            })
        });

        const data = await response.json();
        if (data.error) {
            console.error(data.error);
            window.alert("Something went wrong while adding a description!");
        }
    });
}


/**
 * Handles the change event of a checkbox.
 * 
 * @param event - The change event.
 * 
 */
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

/**
 * Handles the click event of the delete button.
 * @param event - The click event.
 */
export async function handleDeleteButtonClick(event: Event) {
    event.preventDefault();
    const button = event.target as HTMLInputElement;
    const id: number = Number(button.id.replace('delete', ''));
    if (id === 0) {
        return;
    }
    if (window.confirm("Are you sure you want to delete this todo?")) {
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

/**
 * Handles the click event of the menu button.
 * @param event - The click event.
 */
export async function handleMenuButtonClick(event: Event) {
    event.preventDefault();
    const button = event.target as HTMLButtonElement;

    console.log("menu clicked");
    const id: number = Number(button.id.replace('menu', ''));
    if (id === 0) {

        return;
    }

    console.log("menu id: ", id);

    const response = await fetch(`/getTodo/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });


    if (response.status != 200 && response.body == null) {
        console.error(response.status);
        window.alert("Something went wrong while retrieving the todo!");
        return;
    }
    const todo: Todo = await response.json();
    console.log("todo retrieved", todo);

    showModal(todo);
}



/**
 * Handles the change event of a select element.
 * 
 * @param select - The HTMLSelectElement to handle the change event for.
 * @param todos - The array of todos to be updated.
 * @returns A Promise that resolves to the updated array of todos.
 */
export async function handleSelectChange(select: HTMLSelectElement, todos: Todo[]): Promise<Todo[]> {

    select.addEventListener('change', async function (event: Event) {
        event.preventDefault();
        const select = event.target as HTMLSelectElement;
        console.log(select.value);
        todos = sortTodos(todos, select);
        await loadTodoTable(todos);
    });
    return todos;
}