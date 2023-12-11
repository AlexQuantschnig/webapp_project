export class Todo {
    id: number | undefined;
    title: string;
    completed: boolean;
    description: string | undefined;
    creationDate: string | undefined;
    dueDate: string | undefined;
    priority: string | undefined;

    constructor(title: string) {
        this.title = title;
        this.completed = false;
    }

    markAsCompleted(): void {
        this.completed = true;
    }

}
