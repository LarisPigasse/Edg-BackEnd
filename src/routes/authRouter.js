import { Router } from "express";

import {
    login,
    endpointCrypta,
    generaToken,
    profilo
} from "../controllers/utentiController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.get("/genera-token", generaToken);
router.post("/login", login);
router.get("/profilo", checkAuth, profilo);
router.post("/endpoint-crypta", endpointCrypta);

export default router