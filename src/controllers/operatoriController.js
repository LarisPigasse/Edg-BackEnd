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

export const getOperatoriFilter = async (req, res) => {
  try {
    const { pageIndex, pageSize, sort, query } = req.query;

    let ordinamento = {
      order: '',
      key: ''
    }

    if(sort){
      ordinamento = JSON.parse(sort)
    }
   
    let sql = 'SELECT * FROM operatori';
    let where = '';
    let countWhere = '';
  
    if (query) {
      //where = 'WHERE operatore LIKE "%' + query + '%" OR email LIKE "%' + query + '%"';
      where = ` WHERE operatore LIKE "%${query}%" OR email LIKE "%${query}%" `
      countWhere = where;
    }
  
    const limit = pageSize;
    const offset = (pageIndex - 1) * pageSize;

    let orderBy = '';
    if (ordinamento.order != '' && ordinamento.key != '') {
      orderBy = ` ORDER BY ${ordinamento.key} ${ordinamento.order}`

    }
  
   sql += ' ' + where + ' ' + orderBy + ' LIMIT ' + limit + ' OFFSET ' + offset;
  
    const [result] = await pool.query(sql);
    const operatori = result;

    const countSql = 'SELECT COUNT(*) AS count FROM operatori ' + countWhere;
    const countResult = await pool.query(countSql);
    const count = countResult[0][0].count;


    res.json({
      total: count,
      data: operatori
    });


    // let  where;
    // if (query) {
    //   where[Op.or] = [
    //     { uuid_prodotto: { [Op.like]: `%${query}%` } },
    //     { prodotto: { [Op.like]: `%${query}%` } }
    //   ];
    // }

    // let options = optionsWhereTable({where, pageIndex, pageSize, sort})
   
    // const prodotti = await Prodotti.findAll(options);

    // const count = await Prodotti.count(where);

    // res.json({
    //   total: count,
    //   data: prodotti
    // });
  } catch (error) {
    res.status(500).json({ error_msg: 'Errore getOperatoriFilter', error });
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
