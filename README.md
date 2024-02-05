# Todo List Web Application

## Description

This project is a web application for managing a todo list. It allows users to add, remove, and update the description of their todos. The application is built with Node.js and uses Express as the web server. For the frontend styling, Bootstrap is utilized to make the UI user-friendly and responsive. The todos are stored in a MySQL database, ensuring data persistence. HTML files are served from the static folder configured in the Express server, making it easy to manage and update the UI.

## Features

- Add new todos
- Remove existing todos
- Update the description of todos
- Responsive UI with Bootstrap

## Technologies Used

- Node.js
- Express
- MySQL
- Bootstrap
- TypeScript

## Getting Started

### Prerequisites

Before you begin, ensure you have installed the following:
- Node.js
- npm (Node Package Manager)
- MySQL
- TypeScript

### Installation

1. Clone the repository:
    ```
    git clone https://git-iit.fh-joanneum.at/msd-webapp/ws23_students/quantschnig.git
    ```

2. Install the necessary packages: 
    ```
    npm install
    ```
3. Create a new `.env` file in the root directory with the following content: 
    ```
    DBHOST="YOUR DB HOST"
    DBPASS="DB Password"
    DBPORT="DB PORT"
    DBNAME=todo_app
    DBUSER="User of the DB"
    PORT="Port of the webserver"
    ```
4. Create the Database with the SQL Dump:
    
    In the root of the repository you will find the file dbdump.sql.
    Just import this into your db and it will automatically create the database.
    In my case i was using MYSQL Workbench: **Connect to DB -> Server -> Data Import -> select dbdump.sql**

5. Start the application by typing the follwing command in the terminal:
    ```
    npm run dev 
    ```
## Usage

If you follwed the information correctly, you will see that the Server has started on your desired PORT. You can go to the Application by typing `localhost:PORT` in the URL Bar of you Browser.

**The Port should be the one you chose in your `.env` file!**

## Database

The Database is just a simple table with the columns idTodo, title, dueDate, creationDate, completed and description. 

