import { Router } from "express";

import { insertAccount, updateAccount, getAccounts, getAccount, 
    deleteAccount, updatePasswordAccount, getAccountFilter }
        from "../controllers/accountController.js";


import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.use(checkAuth);

router.post("/",  insertAccount);

router.get("/", getAccounts);
router.get("/account-filter", getAccountFilter);
router.get("/:id", getAccount);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);
router.put("/modifica-password/:id", updatePasswordAccount);

export default router;
