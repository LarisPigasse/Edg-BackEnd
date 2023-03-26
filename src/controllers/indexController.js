import { pool } from "../db.js"
import multer from 'multer';
import fs from 'fs';
import path from 'path';


export const salutoedg = (req, res) => res.json({ message: "Un saluto dal server EDG" });

export const getUsers = async (req,res) => {
    try {
  
      const [result] = await pool.query(`SELECT * FROM operatori`);
  
      res.json(result)
      
    } catch (error) {
      console.log(error)
      res.status(404).json({ message: "Errore di conessione", error: error });
    }
}


export const getSpedizioni = async (req,res) => {
    try {
  
      const [result] = await pool.query(`SELECT * FROM spedizioni`);
  
      res.json(result)

    } catch (error) {
      console.log(error)
      //res.json({ couriers: "Selezione spedizioni non riuscita" });
      res.status(404).json({ message: "Errore di conessione", error: error });
    }
}

export const getCustomers = async (req,res) => {
    try {
  
      const [result] = await pool.query(`SELECT * FROM clienti`);
  
      res.json(result)

    } catch (error) {
      console.log(error)
      //res.json({ couriers: "Selezione clienti non riuscita" });
      res.status(404).json({ message: "Errore di conessione", error: error });
    }
}

export const getCouriers = async (req,res) => {
    try {
  
      const [result] = await pool.query(`SELECT c.*, v.vettore FROM corrieri as c
      LEFT JOIN vettori as v ON c.id_vettore = v.id_vettore;`);
  
      res.json(result)

    } catch (error) {
      console.log(error)
      //res.json({ couriers: "Selezione corrieri non riuscita" });
      res.status(404).json({ message: "Errore di conessione", error: error });
    }
}

export const getCarriers = async (req,res) => {
    try {
  
      const [result] = await pool.query(`SELECT * FROM vettori`);
  
      res.json(result)

    } catch (error) {
      console.log(error)
      //res.json({ carriers: "Selezione vettori non riuscita" });
      res.status(404).json({ message: "Errore di conessione", error: error });
    }
}

export const usersRenato = async (req,res) => {
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
}

export const upload = async (req,res) => {
    // Manca trycatch...
    
    //const upload = multer({ dest: 'uploads/' });
    //upload.single('file')

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
}