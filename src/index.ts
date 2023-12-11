import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";
import { Todo } from "./todo";



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

    if (todoDueDate === "") {
        query = `INSERT INTO \`todo_app\`.\`todo\` (\`completed\`, \`title\`) VALUES ('${Number(todo.completed)}', '${todo.title}')`;
    } else {
        todo.dueDate = todoDueDate;
        query = `INSERT INTO \`todo_app\`.\`todo\` (\`completed\`, \`title\`, \`dueDate\`) VALUES ('${Number(todo.completed)}', '${todo.title}', '${todo.dueDate}')`;

    }

    connection.query(query, (err, result) => {
        if (err) throw err;

        console.log('Inserted row', result.insertId);
        res.status(200).redirect('/');
    });

});

app.post('/submit-form', (req, res) => {
    const coin = req.body.name;
    console.log("coin: ", coin);
    res.status(200).redirect('/');
});