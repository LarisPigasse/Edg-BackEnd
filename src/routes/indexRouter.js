import { Router } from "express";
import { salutoedg, getUsers, getSpedizioni,getCustomers,
        getCouriers,getCarriers,usersRenato,upload }
        from "../controllers/indexController.js";

const router = Router();

// cancellare dopo
router.get("/", ({req, res}) => {
    res.json({ message: "Welcome index Router2" }) 
})
router.get("/message", salutoedg);
router.get("/users", getUsers);
router.get("/spedizioni", getSpedizioni);
router.get("/customers", getCustomers);

//forse da finire
router.get("/upload", upload);

export default router;
