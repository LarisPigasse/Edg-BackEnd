import { Router } from "express";

import {
    login,
    endpointCrypta,
    generaToken,
    profilo
} from "../controllers/utentiController.js";

const router = Router();

router.get("/genera-token", generaToken);
router.post("/login", login);
router.get("/profilo", profilo);
router.post("/endpoint-crypta", endpointCrypta);

export default router