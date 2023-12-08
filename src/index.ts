import express from "express";
import path from "path";


const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port} :D`);
});

app.use(express.static('public'));


app.use(express.urlencoded({ extended: true }));

app.post('/submit-form', (req, res) => {
    const coin = req.body.name;
    console.log("coin: ", coin);
    res.status(200).redirect('/');
});



