export class Todo {
    idTodo: number | undefined;
    title: string;
    completed: boolean;
    description: string | undefined;
    creationDate: string;
    dueDate: Date | undefined;
    priority: string | undefined;

    constructor(title: string, creationDate: string) {
        this.title = title;
        this.creationDate = creationDate;
        this.completed = false;
    }
}
