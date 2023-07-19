import { Router } from "express";

import { insertClienti, updateClienti, getClienti, getCliente, 
    deleteClienti }
        from "../controllers/clientiController.js";


import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.use(checkAuth);

router.post("/",  insertClienti);

router.get("/", getClienti);
router.get("/:id", getCliente);
router.put("/:id", updateClienti);
router.delete("/:id", deleteClienti);

export default router;
