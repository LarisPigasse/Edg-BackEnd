const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql');
const bodyparser = require('body-parser');
const upload = multer({ dest: 'uploads/' });
const csvtojson = require('csvtojson')
const app = express();
const path = require('path');
const fs = require('fs');

// NEW
const mysql2 = require('mysql2');
const nodemon = require('nodemon');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql2.createPool({
    host: '212.227.30.12',
    user: 'expressdb',
    password: 'Exp20pr23ess!',
    database: 'express',
    port:3306
});

const promisePool = pool.promise();

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

// file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Errore, upload non eseguito' });
      }
      const oldPath = req.file.path;
      const newPath = path.join(path.dirname(oldPath), req.file.originalname);

      fs.rename(oldPath, newPath, (err) => {
          if (err) throw err;
        
            // Gestisci il file qui
      });
      res.json({ message: 'Upload del file eseguito con successo'});
});


app.get('/usersrenato', async (req, res) => {

    try {

        let id_aggiornamento = 59;
        let file = 'file asdadasdas asdasdasdasdasx12x123x';
        let qta_aggiornata = 1;
        let qta_file = 1;

        const [result] = await promisePool.query(`SELECT id_aggiornamento FROM aggiornamenti WHERE id_aggiornamento = ?`, [id_aggiornamento]);
 
        let result2
        if(result.length>0){
            result2 = await promisePool.query(`UPDATE aggiornamenti SET file = ? ,qta_aggiornata = ?, qta_file = ? WHERE id_aggiornamento = ?`,
                                                         [file,qta_aggiornata,qta_file,id_aggiornamento]);
        }else{
            result2 = await promisePool.query(`INSERT INTO aggiornamenti (id_aggiornamento ,file ,qta_aggiornata, qta_file  ) VALUES(?,?,?,?)`,
                                                         [id_aggiornamento,file,qta_aggiornata,qta_file]);
        }

        res.json({ message: result2 });

    } catch (error) {
      console.log(error)
      res.status(404).json({ message: "Error" });
    }
  
});

//import csv in mysql table
mysqlConnection.query("DROP TABLE sample", 
    (err, drop) => {

    // Query to create table "sample"
    var createStatament = 
    "CREATE TABLE sample(Name char(50), " +
    "Email char(50), Age int, city char(30))"

    // Creating table "sample"
    mysqlConnection.query(createStatament, (err, drop) => {
        if (err)
            console.log("ERROR: ", err);
    });
});

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


app.get('/users', (req, res) => {
    let queryStr = 'SELECT * FROM operatori';
    mysqlConnection.query(queryStr, (err, rows, fields) => {
        if (!err)
            res.json(rows);
        else
            res.json({ users: "Selezione operatori non riuscita" });
    })
});


app.get('/carriers', (req, res) => {
    let queryStr = 'SELECT * FROM vettori';
    mysqlConnection.query(queryStr, (err, rows, fields) => {
        if (!err)
            res.json(rows);
        else
            res.json({ carriers: "Selezione vettori non riuscita" });
    })
});

app.get('/couriers', (req, res) => {
    let queryStr =  `SELECT c.*, v.vettore FROM corrieri as c
                     LEFT JOIN vettori as v ON c.id_vettore = v.id_vettore;
                    `;  
    mysqlConnection.query(queryStr, (err, rows, fields) => {
        if (!err)
            res.json(rows);
        else
            res.json({ couriers: "Selezione corrieri non riuscita" });
    })
});

app.get('/customers', (req, res) => {
    let queryStr = 'SELECT * FROM clienti';
    mysqlConnection.query(queryStr, (err, rows, fields) => {
        if (!err)
            res.json(rows);
        else
            res.json({ couriers: "Selezione clienti non riuscita" });
    })
});

app.get('/spedizioni', (req, res) => {
    let queryStr = 'SELECT * FROM spedizioni';
    mysqlConnection.query(queryStr, (err, rows, fields) => {
        if (!err)
            res.json(rows);
        else
            res.json({ couriers: "Selezione spedizioni non riuscita" });
    })
});

app.get('/message', (req, res) => {
    res.json({ message: "Un saluto dal server EDG" });
});

