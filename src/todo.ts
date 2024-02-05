/**
 * Represents a todo item.
 */
export class Todo {
    /**
     * Creates a new instance of the Todo class.
     * @param title - The title of the todo.
     * @param creationDate - The creation date of the todo.
     * @param completed - Indicates whether the todo is completed or not.
     * @param description - The description of the todo.
     * @param dueDate - The due date of the todo.
     * @param idTodo - The ID of the todo.
     */
    constructor(
        public title: string,
        public creationDate: string,
        public completed?: boolean,
        public description?: string,
        public dueDate?: string,
        public idTodo?: number
    ) { }
}
