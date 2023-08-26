import { Router } from "express";

import { insertClienti, updateClienti, getClienti, getCliente, 
    deleteClienti, getClientiFilter }
        from "../controllers/clientiController.js";


import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.use(checkAuth);

router.post("/",  insertClienti);

router.get("/", getClienti);
router.get("/clienti-filter", getClientiFilter);
router.get("/:id", getCliente);
router.put("/:id", updateClienti);
router.delete("/:id", deleteClienti);


export default router;
