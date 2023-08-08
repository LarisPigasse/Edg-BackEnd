import { pool } from "../db.js"

export const insertClienti = async (req,res) => {
  try {
      const { cliente, indirizzo, citta, cap, provincia, telefono, email,partita_iva ,codice_fiscale, responsabile ,stato } = req.body;

     // let uuid = getUUID();
      const [result] = await pool.query(
          `INSERT INTO clienti (cliente, indirizzo, citta, cap, provincia, telefono, email,partita_iva ,codice_fiscale, responsabile ,stato)
                        VALUES (?, ?, ?, ?,?,?, ?, ?,?,?,?)`,
          [cliente, indirizzo, citta, cap, provincia, telefono, email,partita_iva ,codice_fiscale, responsabile ,stato]
      );
      const id = result.insertId;
      const [rows] = await pool.query('SELECT * FROM clienti WHERE id_cliente = ?', [id]);
      delete rows[0].password
      res.json(rows[0]);
  } catch (err) {
      console.error(err);
      res.status(500).json({ ok:false, message: 'Server error', error: err})
  }
}

export const updateClienti = async (req, res) => {
  try {
      const { cliente, indirizzo, citta, cap, provincia, telefono, email,partita_iva ,codice_fiscale, responsabile ,stato } = req.body;
      const [result] = await pool.query(
          `UPDATE clienti SET cliente = ? , indirizzo = ?, citta = ?,
                 cap = ? , provincia = ?, telefono = ?,
                 email = ? , partita_iva = ?, codice_fiscale = ?, responsabile = ?, stato = ?
                WHERE id_cliente = ?`,
          [cliente, indirizzo, citta, cap, provincia, telefono, email,partita_iva ,codice_fiscale, responsabile ,stato,req.params.id] 
      );

      if (result.affectedRows === 0) {
          return res.status(200).json({ ok:false, message: 'Aggiornamento non eseguito'});
      }
      const [rows] = await pool.query('SELECT * FROM clienti WHERE id_cliente = ?', [req.params.id]);
      res.status(200).json({ ok:true, message: 'Aggiornamento eseguito', utente: rows[0]});

  } catch (err) {
      console.error(err);
      res.status(500).json({ ok:false, message: 'Server error'})
  }
}

export const deleteClienti = async (req, res) => {
  try {
      const [result] = await pool.query('DELETE FROM clienti WHERE id_cliente = ?', [req.params.id]);
      if (result.affectedRows === 0) {
          return res.status(404).json({ ok:false, message: 'Errore cliente'});
      }
      res.status(200).json({ ok:true, message: 'Cliente eliminato correttamente'});
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
}

export const getClienti = async (req,res) => {

  try {

    const [result] = await pool.query('SELECT * FROM clienti');

    res.json(result);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Errore", error: error });
  }
}

export const getCliente = async (req,res) => {
  try {
    let {id} = req.params;

    const [result] = await pool.query(`SELECT * FROM clienti WHERE id_cliente = ?`,[id]);

    if (result.length === 0) {
      return res.status(404).send('Cliente non trovato');
    }

    res.json(result[0])
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Errore", error: error });
  }
}


export const getClientiFilter = async (req, res) => {
  try {
    const { pageIndex, pageSize, sort, query } = req.query;

    let ordinamento = {
      order: '',
      key: ''
    }

    if(sort){
      ordinamento = JSON.parse(sort)
    }
   
    let sql = 'SELECT * FROM clienti';
    let where = '';
    let countWhere = '';
  
    if (query) {
      where = ` WHERE cliente LIKE "%${query}%" OR email LIKE "%${query}%" `
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

    const countSql = 'SELECT COUNT(*) AS count FROM clienti ' + countWhere;
    const countResult = await pool.query(countSql);
    const count = countResult[0][0].count;


    res.json({
      total: count,
      data: operatori
    });

  } catch (error) {
    res.status(500).json({ error_msg: 'Errore getClientiFilter', error });
  }
}