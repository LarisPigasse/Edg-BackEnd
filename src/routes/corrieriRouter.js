import { Router } from "express";

import { insertCorrieri, updateCorrieri, getCorrieri, getCorriere, 
    deleteCorrieri, getCorrieriFilter }
        from "../controllers/corrieriController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.use(checkAuth);

router.post("/",  insertCorrieri);

router.get("/", getCorrieri);
router.get("/corrieri-filter", getCorrieriFilter);
router.get("/:id", getCorriere);
router.put("/:id", updateCorrieri);
router.delete("/:id", deleteCorrieri);

export default router;
