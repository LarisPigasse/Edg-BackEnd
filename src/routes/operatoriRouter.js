import { Router } from "express";

import { insertOperatori, updateOperatori, getOperatori, getOperatore, 
    deleteOperatori  }
        from "../controllers/operatoriController.js";


import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.use(checkAuth);

router.post("/",  insertOperatori);

router.get("/", getOperatori);
router.get("/:id", getOperatore);
router.put("/:id", updateOperatori);
router.delete("/:id", deleteOperatori);

export default router;
