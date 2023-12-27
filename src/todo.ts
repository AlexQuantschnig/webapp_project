export class Todo {
    constructor(
        public title: string,
        public creationDate: string,
        public completed?: boolean,
        public description?: string,
        public dueDate?: string,
        public idTodo?: number
    ) { }
}
