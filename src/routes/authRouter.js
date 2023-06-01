import { Router } from "express";

import {
    login,
    endpointCrypta,
    generaToken
} from "../controllers/utentiController.js";

const router = Router();

router.get("/genera-token", generaToken);
router.post("/login", login);
router.post("/endpoint-crypta", endpointCrypta);

export default router