const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyparser = require('body-parser');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyparser.json());


//MySQL details connection
var mysqlConnection = mysql.createConnection({
    host: '212.227.30.12',
    user: 'expressdb',
    password: 'Exp20pr23ess!',
    database: 'express',
    multipleStatements: true
    });

mysqlConnection.connect((err)=> {
    if(!err)
        console.log('Connessione al database riuscita');
    else
        console.log('Connessione al database fallita'+ JSON.stringify(err,undefined,2));
})

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Il server è in ascolto sulla porta ${port}..`));

app.get('/users', (req, res) => {
    mysqlConnection.query('SELECT * FROM operatori', (err, rows, fields) => {
        if (!err)
            res.json(rows);
        else
            res.json({ users: "Niente di buono dal database remoto" });
    })
});

app.get('/message', (req, res) => {
    res.json({ message: "Un saluto dal server EDG" });
});

