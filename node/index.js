require('dotenv').config();

const express = require("express");
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({"msg": "Hello World"});
})


app.get('/html', (req, res) => {
    res.status(200).send(`
        <html>
            <head>
            </head>
            <body>
                <p style="color: green; font-weight: bold;">This is a HTML page.</p>
            </body>
        </html>
    `);
});

app.listen(3000, () => {
    console.log("Server running...");
});

const database = require("./config/database");

app.use('/countries', require('./routes/countries'));
app.use('/continents', require('./routes/continents'));


