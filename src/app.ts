import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";
import { Todo } from "./todo.js";
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


    const creationDate: string = moment(Date.now()).format('YYYY-MM-DD HH:mm');

    const todo = new Todo(todoTitle, creationDate, false, undefined, undefined, undefined);
    let query: string;
    let inserts: any[];



    if (todoDueDate === "") {
        query = "INSERT INTO `todo_app`.`todo` (`completed`, `title`, `creationDate`) VALUES (?, ?, ?)";
        inserts = [Number(todo.completed), todo.title, todo.creationDate];
    } else {
        todo.dueDate = todoDueDate;
        query = "INSERT INTO `todo_app`.`todo` (`completed`, `title`, `dueDate`, `creationDate`) VALUES (?, ?, ?, ?)";
        inserts = [Number(todo.completed), todo.title, todo.dueDate, todo.creationDate];
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

app.get('/getTodo/:id', (req, res) => {
    const id: number = Number(req.params.id);
    console.log("get id: ", id);

    connection.query('SELECT * FROM todo WHERE idTodo = ?', [id], (err, result) => {
        if (err) {
            res.send("Error retrieving todo from database");
            return;
        }
        const row = result[0];
        console.log("retrieved row", row.dueDate);
        const todo = new Todo(
            row.title,
            row.creationDate,
            row.completed,
            row.description,
            row.dueDate,
            row.idTodo
        );
        console.log("retrieved todo", todo);
        res.status(200).json(todo);
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

app.put('/updateDescription/:id', (req, res) => {
    const id: number = Number(req.params.id);
    const description: string = req.body.description;
    console.log("update id: ", id);
    console.log("update description: ", description);

    const query = "UPDATE `todo_app`.`todo` SET `description` = ? WHERE (`idTodo` = ?)";

    connection.query(query, [description, id], (err, result) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(`Updated ${result.affectedRows} row`);
        res.status(200);
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