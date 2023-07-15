
import express from 'express';
import dotenv from "dotenv";
import cors from "cors";

import indexRouter from "./routes/indexRouter.js";
import authRouter from "./routes/authRouter.js";
import backendRouter from "./routes/backendRouter.js";
import operatoriRouter from "./routes/operatoriRouter.js";

const app = express();

// Middlewares

//dotenv.config();
// CORS
// const whitelist = ['http://localhost:5173'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.includes(origin)) {
//       // OK
//       callback(null, true);
//     } else {
//       // NO AUTH
//       callback(new Error("Error de Cors"));
//     }
//   },
// };
// app.use(cors(corsOptions));

// Routes

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.use("/api",indexRouter);
app.use("/api/auth",authRouter);
app.use("/api/backend",backendRouter);
app.use("/api/operatori",operatoriRouter);


app.use((req, res, next) => {
  res.status(404).json({ message: "Not found..." });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server ON Port: ${port}`));
