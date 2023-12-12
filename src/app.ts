import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";
import { Todo } from "./todo";
import moment from "moment";



dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port} :D`);
});

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DBHOST,
    port: Number(process.env.DBPORT),
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db', err);
        return;
    }
    console.log('Connection established');
});

app.post('/addTodo', (req, res) => {

    const todoTitle: string = req.body.todoTitle;
    const todoDueDate: string = req.body.dueDate;
    const todo = new Todo(todoTitle);
    let query: string;
    let inserts: any[];

    const creationDate: string = moment(Date.now()).format('YYYY-MM-DD HH:mm');

    if (todoDueDate === "") {
        query = "INSERT INTO `todo_app`.`todo` (`completed`, `title`, `creationDate`) VALUES (?, ?, ?)";
        inserts = [Number(todo.completed), todo.title, creationDate];
    } else {
        todo.dueDate = new Date(todoDueDate);
        query = "INSERT INTO `todo_app`.`todo` (`completed`, `title`, `dueDate`, `creationDate`) VALUES (?, ?, ?, ?)";
        inserts = [Number(todo.completed), todo.title, todo.dueDate, creationDate];
    }

    connection.query(query, inserts, (err, result) => {
        if (err) {
            res.send("Error inserting todo into database");
            return;
        }

        console.log(`Inserted ${result.affectedRows} row`);
        res.status(200).json({ message: `${todo.title}` });
    });

});

app.get('/getTodos', (req, res) => {

    connection.query('SELECT * FROM todo', (err, result) => {
        if (err) {
            res.send("Error retrieving todos from database");
            return;
        }
        console.log(`Retrieved ${result.length} rows`);
        res.status(200).json(result);
    });

});

app.put('/todos/:id', (req, res) => {
    const id: number = Number(req.params.id);
    const completed: number = Number(req.body.completed);

    const query = "UPDATE `todo_app`.`todo` SET `completed` = '?' WHERE (`idTodo` = '?')";

    connection.query(query, [completed, id], (err, result) => {
        if (err) {
            res.send("Error updating todo in database");
            return;
        }

        console.log(`Updated ${result.affectedRows} row`);
        res.status(200).send("Success");
    });
});

app.delete('/deleteTodo/:id', (req, res) => {
    const id: number = Number(req.params.id);
    console.log("delete id: ", id);

    const query = "DELETE FROM `todo_app`.`todo` WHERE (`idTodo` = ?);";

    connection.query(query, [id], (err, result) => {
        if (err) {
            res.send("Error deleting todo from database");
            return;
        }

        console.log(`Deleted ${result.affectedRows} row`);
        res.status(200).send("Success");
    });
});