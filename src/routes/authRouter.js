import { Router } from "express";

import {
    endpointCrypta,
    generaToken
} from "../controllers/utentiController.js";

import { login, profilo } from "../controllers/authController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.get("/genera-token", generaToken);
router.post("/endpoint-crypta", endpointCrypta);


router.post("/login", login);
router.get("/profilo", checkAuth, profilo);

export default router