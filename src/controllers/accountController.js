import { pool } from "../db.js"

import { cryptaPassword } from '../helpers/passwords.js'


export const insertAccount = async (req,res) => {
  try {
      const { id_cliente, account, email, password, nickname, stato } = req.body;

      let password_crypt = cryptaPassword(password)

     // let uuid = getUUID();
      const [result] = await pool.query(
          `INSERT INTO account (id_cliente, account, email, password, nickname, stato)
                        VALUES (?, ?, ?, ?,?,?)`,
          [id_cliente, account, email, password_crypt, nickname, stato]
      );
      const id = result.insertId;
      const [rows] = await pool.query('SELECT * FROM account WHERE id_account = ?', [id]);
      delete rows[0].password
      res.json(rows[0]);
  } catch (err) {
      console.error(err);
      res.status(500).json({ ok:false, message: 'Server error', error: err})
  }
}

export const updateAccount = async (req, res) => {
  try {
      const { id_cliente, account, email,  nickname, stato } = req.body;
      const [result] = await pool.query(
          `UPDATE account SET id_cliente = ? , account = ?, email = ?, nickname = ? , stato = ?
                WHERE id_account = ?`,
          [id_cliente, account, email, nickname, stato,req.params.id] 
      );

      if (result.affectedRows === 0) {
          return res.status(200).json({ ok:false, message: 'Aggiornamento non eseguito'});
      }
      const [rows] = await pool.query('SELECT * FROM account WHERE id_account = ?', [req.params.id]);
      delete rows[0].password
      res.status(200).json({ ok:true, message: 'Aggiornamento eseguito', utente: rows[0]});

  } catch (err) {
      console.error(err);
      res.status(500).json({ ok:false, message: 'Server error'})
  }
}

export const deleteAccount = async (req, res) => {
  try {
      const [result] = await pool.query('DELETE FROM account WHERE id_account = ?', [req.params.id]);
      if (result.affectedRows === 0) {
          return res.status(404).json({ ok:false, message: 'Errore account'});
      }
      res.status(200).json({ ok:true, message: 'Account eliminato correttamente'});
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
}

export const getAccounts = async (req,res) => {

  try {

    const [result] = await pool.query('SELECT * FROM account');

    res.json(result);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Errore", error: error });
  }
}

export const getAccount = async (req,res) => {
  try {
    let {id} = req.params;

    const [result] = await pool.query(`SELECT * FROM account WHERE id_account = ?`,[id]);

    if (result.length === 0) {
      return res.status(404).send('Account non trovato');
    }

    res.json(result[0])
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Errore", error: error });
  }
}


export const returnAccount = async (id_account) => {
    try {
      const [result] = await pool.query(`SELECT * FROM account WHERE id_account = ?`,[id_account]);
  
      if (!result[0]) {
        return [];
      }
  
      result[0]._id = result[0].id_account;
      return result[0];
    } catch (error) {
      return [];
    }
}

export const updatePasswordAccount = async (req, res) => {
    try {
  
      const { password } = req.body;
  
      let password_crypt = await cryptaPassword(password);
  
      const [result] = await pool.query('UPDATE account SET password = ? WHERE id_account = ?', [password_crypt,req.params.id]);
    
      if (result.affectedRows === 0) {
          return res.status(404).json({ ok:false, message: 'Errore operatore'});
      }
  
      res.status(200).json({ ok:true, message: 'Password modificata correttamente'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok:false, message: 'Errore', error: error});
    }
  }