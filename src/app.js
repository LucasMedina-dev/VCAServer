import express from "express";
import domainRoutes from "./routes/domainRoutes.js";
import hitRoutes from "./routes/hitRoutes.js";
import cors from 'express'

const app = express();
const URL= 'http://localhost:4200'
const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  res.header("Access-Control-Allow-Headers", "KEY, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Origin", URL);
  //next()
  origin === URL ? next() : res.status(403).json({ error: "Forbidden" }); // Solo next para pruebas locales, esta linea para permitir localhost:4200
};

app.set('trust proxy', true);
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
app.use("/hit", hitRoutes);
app.use(corsMiddleware)
app.use("/domains", domainRoutes);

app.listen(3000);
console.log("Listening at port 3000");
