import { Router } from "express";
import { salutoedg, upload }
        from "../controllers/indexController.js";

const router = Router();

// cancellare dopo
router.get("/", ({req, res}) => {
    console.log(req);
    res.json({ message: "Welcome index Router" }) 
})

router.get("/message", salutoedg);

//forse da finire
router.get("/upload", upload);

export default router;
