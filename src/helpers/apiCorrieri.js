import { apiFetch } from "../helpers/apiFetch.js";

import { aggiornaEsiti } from "../controllers/spedizioniController.js"

import dotenv from "dotenv";

export const apiDachser = async (codice_spedizione) => {

    dotenv.config();

    let result = await apiFetch({
      url:`https://api-gateway.dachser.com/rest/v2/shipmentstatus?tracking-number=${codice_spedizione}`,
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.TOKEN_DACHSER
      }
    });

    let tracking = result.shipments[0].status[0].event.description; //
    let data_tracking = result.shipments[0].status[0].statusDate;

    aggiornaEsiti(codice_spedizione, tracking, data_tracking);

   return result;
}


export const splitCorrieri = async (id_corriere, altro_numero) => {

  switch (id_corriere) {
    case 1:
      return await apiDachser(altro_numero)
    default:
      return false;
  }

}