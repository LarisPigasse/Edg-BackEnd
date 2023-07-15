import { pool } from "../db.js"
import getUUID from '../helpers/generaUUID.js'

import { cryptaPassword, verifyPassword } from '../helpers/passwords.js'


export const insertOperatori = async (req,res) => {
  try {
      const { operatore, email, profilo, password } = req.body;

      let password_crypt = await cryptaPassword(password);


     // let uuid = getUUID();
      const [result] = await pool.query(
          `INSERT INTO operatori (operatore, email, profilo, password) VALUES (?, ?, ?,?)`,
          [operatore, email, profilo,password_crypt]
      );
      const id = result.insertId;
      const [rows] = await pool.query('SELECT * FROM operatori WHERE id_operatore = ?', [id]);
      delete rows[0].password
      res.json(rows[0]);
  } catch (err) {
      console.error(err);
      res.status(500).json({ ok:false, message: 'Server error', error: err})
  }
}

export const updateOperatori = async (req, res) => {
  try {
      const { operatore, email, profilo } = req.body;
      const [result] = await pool.query(
          'UPDATE operatori SET operatore = ? , email = ?, profilo = ? WHERE id_operatore = ?',
          [operatore, email, profilo, req.params.id]
      );

      if (result.affectedRows === 0) {
          return res.status(200).json({ ok:false, message: 'Aggiornamento non eseguito'});
      }
      const [rows] = await pool.query('SELECT * FROM operatori WHERE id_operatore = ?', [req.params.id]);
      res.status(200).json({ ok:true, message: 'Aggiornamento eseguito', utente: rows[0]});

  } catch (err) {
      console.error(err);
      res.status(500).json({ ok:false, message: 'Server error'})
  }
}

export const deleteOperatori = async (req, res) => {
  try {
      const [result] = await pool.query('DELETE FROM operatori WHERE id_operatore = ?', [req.params.id]);
      if (result.affectedRows === 0) {
          return res.status(404).json({ ok:false, message: 'Errore operatore'});
      }
      res.status(200).json({ ok:true, message: 'Operatore eliminato correttamente'});
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
}

export const getOperatori = async (req,res) => {

  try {

    const [result] = await pool.query('SELECT * FROM operatori');

    res.json(result);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Errore", error: error });
  }
}


export const getOperatore = async (req,res) => {
  try {
    let {id} = req.params;

    const [result] = await pool.query(`SELECT * FROM operatori WHERE id_operatore = ?`,[id]);

    if (result.length === 0) {
      return res.status(404).send('Operatore non trovato');
    }

    res.json(result[0])
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Errore", error: error });
  }
}



//////
export const updatePasswordOperatori = async (req, res) => {
  try {

    const { password } = req.body;

    let password_crypt = await cryptaPassword(password);

    const [result] = await pool.query('UPDATE operatori SET password = ? WHERE id_operatore = ?', [password_crypt,req.params.id]);
  
    if (result.affectedRows === 0) {
        return res.status(404).json({ ok:false, message: 'Errore operatore'});
    }

    res.status(200).json({ ok:true, message: 'Password modificata correttamente'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok:false, message: 'Errore', error: error});
  }
}

