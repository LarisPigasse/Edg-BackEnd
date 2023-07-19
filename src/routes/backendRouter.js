import { Router } from "express";
import { salutoedg,upload,testfile }
        from "../controllers/indexController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = Router();

router.use(checkAuth);

// cancellare dopo
router.get("/", ({req, res}) => {
    res.json({ message: "Welcome index Router" }) 
})
router.get("/message", salutoedg);

//forse da finire
router.get("/upload", upload);

router.get("/testfiles", testfile);

router.get('/testfilesxxx', (req, res) => {

  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = dirname(__filename);

  // const folderPath = path.join(__dirname, '../../files');
  // const newFolderPath = path.join(__dirname, '../../files/caricati');

  // fs.readdir(folderPath, (err, files) => {
  //   if (err) {
  //     console.error('Error al leer la carpeta:', err);
  //     return res.status(500).send('Error al leer la carpeta');
  //   }

  //   const elements = [];

  //   files.forEach(file => {
  //     const filePath = path.join(folderPath, file);
  //     const isFolder = fs.statSync(filePath).isDirectory();
  //     const props = fs.statSync(filePath);

  //     elements.push({
  //       nome: file,
  //       isFolder: isFolder,
  //       size: props.size,
  //       dataUpdate: props.mtime
  //     });

  //     const pathFile = path.join(folderPath, file);
  //     const newPathFile = path.join(newFolderPath, file);

  //     if(!isFolder){
  //       fs.rename(pathFile, newPathFile, (err) => {
  //         if (err) {
  //           console.error(`Error al mover el archivo ${file}:`, err);
  //           return;
  //         }

  //         console.log(`El archivo ${file} se ha movido correctamente.`);
  //       });
  //     }

  //   });

  //   res.json(elements);
  // });

});

export default router;