import { Router } from "express";

import { insertSpedizioni, updateSpedizione, getSpedizioni, getSpedizione, 
    deleteSpedizioni, getSpedizioniFilter, getSpedizioniCliente }
        from "../controllers/spedizioniController.js";


import checkAuth from "../middleware/checkAuth.js";

const router = Router();

//router.use(checkAuth);

router.post("/",  insertSpedizioni);

router.get("/", getSpedizioni);
router.get("/spedizioni-filter", getSpedizioniFilter);
router.get("/:id", getSpedizione);
router.get("/:id", getSpedizioniCliente);
router.put("/:id", updateSpedizione);
router.delete("/:id", deleteSpedizioni);

export default router;
