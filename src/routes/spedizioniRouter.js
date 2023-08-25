import { Router } from "express";

import { insertSpedizioni, updateSpedizione, getSpedizioni, getSpedizione, getSpedizioniClientiFilter, getSpedizioniClientiArchiviateFilter,
    deleteSpedizioni, getSpedizioniFilter, getSpedizioniCliente,importaEsiti,archiviaSpedizioni, getSpedizioniClienti, getSpedizioniClientiArchiviate }
        from "../controllers/spedizioniController.js";


import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.use(checkAuth);

router.post("/",  insertSpedizioni);

router.get("/spedizioni-clienti", getSpedizioniClienti);
router.get("/spedizioni-clienti-archiviate", getSpedizioniClientiArchiviate);

router.put("/archivia-spedizione", archiviaSpedizioni);
router.get("/importa", importaEsiti);
router.get("/", getSpedizioni);
router.get("/spedizioni-filter", getSpedizioniFilter);
router.get("/spedizioni-filter-clienti", getSpedizioniClientiFilter);
router.get("/spedizioni-filter-clienti-archiviate", getSpedizioniClientiArchiviateFilter);
router.get("/:id", getSpedizione);
router.get("/:id", getSpedizioniCliente);
router.put("/:id", updateSpedizione);
router.delete("/:id", deleteSpedizioni);

export default router;
