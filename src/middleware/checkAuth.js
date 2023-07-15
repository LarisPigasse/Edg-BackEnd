import jwt from "jsonwebtoken";
import { returnUtente } from "../controllers/utentiController.js";

const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.utente = await returnUtente(decoded.id);
      delete req.utente.password

      return next();
    } catch (error) {
      return res.status(404).json({ msg: "Token non valido." });
    }
  }

  if (!token) {
    const error = new Error("Invalid token");
    return res.status(401).json({ msg: error.message });
  }

  next();
};

export default checkAuth;
