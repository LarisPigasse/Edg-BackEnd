import { Router } from "express";
import { salutoedg, getUsers, getSpedizioni,getCustomers,
        getCouriers,getCarriers,usersRenato,upload }
        from "../controllers/indexController.js";

const router = Router();

// cancellare dopo
router.get("/", ({req, res}) => {
    console.log(req);
    
    res.json({ message: "Welcome index Router2" }) 
})
router.get("/message", salutoedg);
router.get("/users", getUsers);
router.get("/spedizioni", getSpedizioni);
router.get("/customers", getCustomers);

//forse da finire
router.get("/upload", upload);

router.get('/archivos', (req, res) => {
    const rutaCarpeta = '../files';
  
    fs.readdir(rutaCarpeta, (err, archivos) => {
      if (err) {
        console.error('Error al leer la carpeta:', err);
        res.status(500).send('Error al leer la carpeta');
        return;
      }
  
      // Ciclar los archivos
      archivos.forEach((archivo) => {
        // Aquí puedes realizar cualquier operación con cada archivo
        console.log(archivo);
      });
  
      res.json('Archivos ciclados');
    });
});

export default router;
