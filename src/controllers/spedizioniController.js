import { pool } from "../db.js"

import { splitCorrieri, apiDashser} from "../helpers/apiCorrieri.js";

import dotenv from "dotenv";

export const importaEsiti = async (req, res) => {

  dotenv.config();

  // query che prende tutte le spedizioni in base a qualcosa.
  try {

    const [result] = await pool.query('SELECT * FROM spedizioni');
    let ok;
    
    
    let da_eseguire = result.map(async (r, index)=>{
    
      if (r.id_corriere == 1) {

        return await splitCorrieri(r.id_corriere, r.altro_numero);
       
      }else{
        return false;
      }
    
    })

     ok = await Promise.all(da_eseguire);
    
    //ok = await apiDashser( "04930755679");
    res.json(ok);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Errore", error: error });
  }

  return;
  let barcode = "04930755679"

  //let result = await apiDashser(barcode);

}
export const insertSpedizioni = async (req,res) => {
    try {
        const { id_cliente, id_spedizione, id_corriere, id_vettore, data_spedizione, quantita, peso_kg, peso_misurato, peso_volume, volume_misurato, 
                altro_numero, destinazione, destinatario, indirizzo, cap, citta, codice_nazione, discriminante, documento, tracking } = req.body;
  

        const [result] = await pool.query(
            `INSERT INTO spedizioni (id_cliente, id_spedizione, id_corriere, id_vettore, data_spedizione, quantita, peso_kg, peso_misurato, peso_volume, volume_misurato,
                                    altro_numero, destinazione, destinatario, indirizzo, cap, citta, codice_nazione, discriminante, documento, tracking)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id_cliente, id_spedizione, id_corriere, id_vettore, data_spedizione, quantita, peso_kg, peso_misurato, peso_volume, volume_misurato, 
                altro_numero, destinazione, destinatario, indirizzo, cap, citta, codice_nazione, discriminante, documento, tracking]
        );
        const [idCliente, idSpedizione] = result.insertId;
        const [rows] = await pool.query('SELECT * FROM spedizioni WHERE id_cliente = ? AND id_spedizione=?', [idCliente, idSpedizione]);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok:false, message: 'Server error', error: err})
    }
  }


  export const updateSpedizione = async (req, res) => {
    try {
        const { id_corriere, id_vettore, data_spedizione, quantita, peso_kg, peso_misurato, peso_volume, volume_misurato, 
                altro_numero, destinazione, destinatario, indirizzo, cap, citta, codice_nazione, discriminante, documento, tracking } = req.body;
        const [result] = await pool.query(
            `UPDATE spedizioni SET id_corriere = ?, id_vettore = ? , data_spedizione = ?, quantita = ?, peso_kg = ?, peso_misurato = ?, peso_volume = ?, 
                                   volume_misurato = ?, altro_numero = ?, destinazione = ?, destinatario = ?,  indirizzo = ?, cap = ?, citta = ?,
                                   codice_nazione = ?, discriminante = ?, documento = ?, tracking = ?
                  WHERE id_cliente = ? AND id_spedizione = ?`,
            [id_corriere, id_vettore, data_spedizione, quantita, peso_kg, peso_misurato, peso_volume, volume_misurato, altro_numero, destinazione, 
                destinatario, indirizzo, cap, citta, cap, codice_nazione, discriminante, documento, tracking]
        );
  
        if (result.affectedRows === 0) {
            return res.status(200).json({ ok:false, message: 'Aggiornamento non eseguito'});
        }
        const [rows] = await pool.query('SELECT * FROM spedizioni WHERE id_cliente = ? AND id_spedizione = ?', [req.params.id]);
        res.status(200).json({ ok:true, message: 'Aggiornamento eseguito', utente: rows[0]});
  
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok:false, message: 'Server error'})
    }
  }

  export const deleteSpedizioni = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM spedizioni WHERE id_cliente = ? AND id_spedizione = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok:false, message: 'Errore spedizione'});
        }
        res.status(200).json({ ok:true, message: 'Spedizione eliminata correttamente'});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
  }

  export const getSpedizioni = async (req,res) => {

    try {
  
      const [result] = await pool.query('SELECT * FROM spedizioni');
  
      res.json(result);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Errore", error: error });
    }
  }


  export const getSpedizione = async (req,res) => {
    try {
      let {id} = req.params;
  
      const [result] = await pool.query(`SELECT * FROM spedizioni WHERE id_spedizione = ?`,[id]);
  
      if (result.length === 0) {
        return res.status(404).send('Spedizione non trovata');
      }
  
      res.json(result[0])
      
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Errore", error: error });
    }
  }

  export const getSpedizioniCliente = async (req,res) => {
    try {
      let {id} = req.params;
  
      const [result] = await pool.query(`SELECT * FROM spedizioni WHERE id_cliente = ?`,[id]);
  
      if (result.length === 0) {
        return res.status(404).send('Spedizioni non trovata');
      }
  
      res.json(result[0])
      
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Errore", error: error });
    }
  }

  export const getSpedizioniFilter = async (req, res) => {
    try {
      const { pageIndex, pageSize, sort, query } = req.query;
  
      let ordinamento = {
        order: '',
        key: ''
      }
  
      if(sort){
        ordinamento = JSON.parse(sort)
      }
     
      let sql = 'SELECT * FROM spedizioni';
      let where = '';
      let countWhere = '';
    
      if (query) {
        where = ` WHERE destinatario LIKE "%${query}%" `
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
  
      const countSql = 'SELECT COUNT(*) AS count FROM spedizioni ' + countWhere;
      const countResult = await pool.query(countSql);
      const count = countResult[0][0].count;
  
  
      res.json({
        total: count,
        data: operatori
      });
  
    } catch (error) {
      res.status(500).json({ error_msg: 'Errore getSpedizioniFilter', error });
    }
  }