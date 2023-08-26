import { pool } from "../db.js"

export const insertCorrieri = async (req, res) => {
  try {
    const { corriere, endpoint, stato } = req.body;

    const [result] = await pool.query(
      `INSERT INTO corrieri (corriere, endpoint, stato) VALUES (?, ?, ?)`,
      [corriere, endpoint, stato]
    );

    const id = result.insertId;
    const [rows] = await pool.query('SELECT * FROM corrieri WHERE id_corriere = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Errore del server', error: err });
  }
}

export const updateCorrieri = async (req, res) => {
  try {
    const { corriere, endpoint, stato } = req.body;

    const [result] = await pool.query(
      `UPDATE corrieri SET corriere = ?, endpoint = ?, stato = ? WHERE id_corriere = ?`,
      [corriere, endpoint, stato, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(200).json({ ok: false, message: 'Aggiornamento non eseguito' });
    }

    const [rows] = await pool.query('SELECT * FROM corrieri WHERE id_corriere = ?', [req.params.id]);
    res.status(200).json({ ok: true, message: 'Aggiornamento eseguito', corriere: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: 'Errore del server' });
  }
}

// Altre funzioni analoghe (deleteCorriere, getCorriere, getCorrieri, getCorrieriFilter) adattate alla struttura della tabella corrieri

// Esempio di come potrebbe essere implementata la funzione getCorrieri
export const getCorrieri = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM corrieri');
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Errore", error: error });
  }
}

export const deleteCorrieri = async (req, res) => {
  try {
      const [result] = await pool.query('DELETE FROM corrieri WHERE id_corriere  = ?', [req.params.id]);
      if (result.affectedRows === 0) {
          return res.status(404).json({ ok:false, message: 'Errore corriere'});
      }
      res.status(200).json({ ok:true, message: 'Corriere eliminato correttamente'});
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
}

export const getCorriere = async (req,res) => {

  try {

    const [result] = await pool.query('SELECT * FROM corrieri');

    res.json(result);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Errore", error: error });
  }
}

export const getCorrieriFilter = async (req, res) => {
  try {
    const { pageIndex, pageSize, sort, query } = req.query;

    let ordinamento = {
      order: '',
      key: ''
    }

    if(sort){
      ordinamento = JSON.parse(sort)
    }
   
    let sql = 'SELECT * FROM corrieri';
    let where = '';
    let countWhere = '';
  
    if (query) {
      where = ` WHERE corriere LIKE "%${query}%" OR endpoint LIKE "%${query}%" `
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
    const corrieri = result;

    const countSql = 'SELECT COUNT(*) AS count FROM corrieri ' + countWhere;
    const countResult = await pool.query(countSql);
    const count = countResult[0][0].count;


    res.json({
      total: count,
      data: corrieri
    });

  } catch (error) {
    res.status(500).json({ error_msg: 'Errore getClientiFilter', error });
  }
}