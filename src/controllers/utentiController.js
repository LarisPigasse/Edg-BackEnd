import { pool } from "../db.js"
import getUUID from '../helpers/generaUUID.js'
import generarJWT from '../helpers/generarJWT.js'

import { cryptaPassword, verifyPassword } from '../helpers/passwords.js'

export const endpointCrypta = async (req, res) => {
  try {

    const { password } = req.body;

    let password_crypt = await cryptaPassword(password);

    res.status(200).json({ ok:true, message:password_crypt});
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok:false, message: 'Errore', error: error});
  }
}

export const generaToken = async (req,res) => {

  try {
    res.json(generarJWT(888));

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Errore", error: error });
  }
}

export const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    // Verificare se esiste l'email
    const [result] = await pool.query(`SELECT * FROM account WHERE email = ?`,[email]);

    if (!result[0]) {
      const error = new Error("L'utente non esiste");
      return res.status(404).json({ ok:false, messagge: error.message });
    }
  
    // Verificare password
    if (await verifyPassword(password, result[0].password)) {
      res.status(200).json({
        ok:true,
        utente: {_id: result[0].id_account,
          account: result[0].account,
          email: result[0].email,
          token: generarJWT(result[0].id_account)
        }
      });
    } else {
      //const error = new Error("La password non è corretta");
      return res.status(401).json({ ok:false, messagge: "La password non e corretta" });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok:false, messagge: error });

  }

}

export const getUtenti = async (req,res) => {

  try {

    const [result] = await pool.query('SELECT *, id_utente as id FROM utenti');

    res.json(result);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Errore", error: error });
  }
}

export const returnUtente = async (id_account) => {
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


export const getUtente = async (req,res) => {
  try {
    let {id} = req.params;

    const [result] = await pool.query(`SELECT * FROM utenti WHERE uuid_utente = ?`,[id]);

    if (result.length === 0) {
      return res.status(404).send('User not found');
    }

    res.json(result[0])
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Errore", error: error });
  }
}

export const insertUtente = async (req,res) => {
  try {
      const { utente, email, tipo_utente } = req.body;
      let uuid = getUUID();
      const [result] = await pool.query(
          `INSERT INTO utenti (utente, email, tipo_utente, uuid_utente) VALUES (?, ?, ?, ?)`,
          [utente, email, tipo_utente,uuid]
      );
      const id = result.insertId;
      const [rows] = await pool.query('SELECT * FROM utenti WHERE id_utente = ?', [id]);
      delete rows[0].password
      res.json(rows[0]);
  } catch (err) {
      console.error(err);
      res.status(500).json({ ok:false, message: 'Server error', error: err})
  }
}

export const updateUtente = async (req, res) => {
  try {
      const { utente, email, tipo_utente } = req.body;
      const [result] = await pool.query(
          'UPDATE utenti SET utente = ?, email = ?, tipo_utente = ? WHERE uuid_utente = ?',
          [utente, email, tipo_utente, req.params.id]
      );

      if (result.affectedRows === 0) {
          return res.status(200).json({ ok:false, message: 'Aggiornamento non eseguito'});
      }
      const [rows] = await pool.query('SELECT * FROM utenti WHERE uuid_utente = ?', [req.params.id]);
      res.status(200).json({ ok:true, message: 'Aggiornamento eseguito', utente: rows[0]});

  } catch (err) {
      console.error(err);
      res.status(500).json({ ok:false, message: 'Server error'})
  }
}

export const updateUtentePassword = async (req, res) => {
  try {

    const { password } = req.body;

    let password_crypt = await cryptaPassword(password);

    const [result] = await pool.query('UPDATE utenti SET password = ? WHERE uuid_utente = ?', [password_crypt,req.params.id]);
  
    if (result.affectedRows === 0) {
        return res.status(404).json({ ok:false, message: 'Errore utente'});
    }

    res.status(200).json({ ok:true, message: 'Password modificata correttamente'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok:false, message: 'Errore', error: error});
  }
}

export const deleteUtente = async (req, res) => {
  try {
      const [result] = await pool.query('DELETE FROM utenti WHERE uuid_utente = ?', [req.params.id]);
      if (result.affectedRows === 0) {
          return res.status(404).json({ ok:false, message: 'Errore utente'});
      }
      res.status(200).json({ ok:true, message: 'Utente eliminato correttamente'});
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
}

export const profilo = async (req, res) => {
  const { utente } = req;

  res.json(utente);
}