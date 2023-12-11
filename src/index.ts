const form = document.getElementById('addTodoForm') as HTMLFormElement;

form.addEventListener('submit', async function (event: Event) {

    event.preventDefault();

    const response = await fetch('/addTodo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            todoTitle: (this.elements.namedItem('todoTitle') as HTMLInputElement).value,
        })
    });

    const data = await response.json();

    if (data.error) {
        console.error(data.error);
        window.alert("Something went wrong while adding a todo!");
    } else {
        console.log("Success! added" + data.message);
        window.alert("Success! added " + data.message);
    }
});

// window.onload = async function () {
//     try {
//         const response = await fetch('/getTodos');
//         const todos = await response.json();

//         const ul = document.querySelector('.list-group');

//         todos.forEach(todo => {
//             const li = document.createElement('li');
//             li.className = 'list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent';

//             const div = document.createElement('div');
//             div.className = 'form-check';

//             const input = document.createElement('input');
//             input.className = 'form-check-input me-0';
//             input.type = 'checkbox';
//             input.id = 'flexCheckChecked' + todo.id;
//             input.checked = todo.completed;

//             const p = document.createElement('p');
//             p.className = 'lead fw-normal mb-0 text-white';
//             p.textContent = todo.title;

//             div.appendChild(input);
//             li.appendChild(div);
//             li.appendChild(p);
//             ul.appendChild(li);
//         });
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };

