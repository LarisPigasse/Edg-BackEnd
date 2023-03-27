// Invece di fare:
// const express = require('express')
// fare:
// import express from 'express'

import express from 'express';
import dotenv from "dotenv";
import cors from "cors";

import indexRoutes from "./routes/indexRouter.js";

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

app.use("/",indexRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Il server è in ascolto sulla porta ${port}..`));
