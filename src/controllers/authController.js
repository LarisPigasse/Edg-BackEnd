
import { pool } from "../db.js"
import generarJWT from '../helpers/generarJWT.js'

import {  verifyPassword } from '../helpers/passwords.js'

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
            token: generarJWT(result[0].id_account),
            tipo_account:result[0].tipo_account
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

export const profilo = async (req, res) => {
    const { account } = req;
  
    res.json(account);
}
  