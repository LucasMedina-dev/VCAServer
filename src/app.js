import express from "express";
import domainRoutes from "./routes/domainRoutes.js";
import cors from 'express'

const app = express();
const URL= 'http://localhost:4200'
const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Origin", URL);
  origin === URL ? next() : res.status(403).json({ error: "Forbidden" });
};

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
app.use(corsMiddleware)
app.use("/domains", domainRoutes);

app.listen(3000);
console.log("Listening at port 3000");
