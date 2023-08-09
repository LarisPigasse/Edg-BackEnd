import { apiFetch } from "../helpers/apiFetch.js";

import dotenv from "dotenv";

export const apiDashser = async (codice_spedizione) => {

    dotenv.config();
  
    //let barcode = "04930755679"
  
    let result = await apiFetch({
      url:`https://api-gateway.dachser.com/rest/v2/shipmentstatus?tracking-number=${codice_spedizione}`,
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.TOKEN_DACHSER
      }
    });
  
   return result;
}