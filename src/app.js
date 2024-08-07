import express from "express";
import domainRoutes from "./routes/domainRoutes.js";
import hitRoutes from "./routes/hitRoutes.js";
import cors from 'cors'

const app = express();
const URL= 'https://visitorcounterapi.vercel.app'

app.set('trust proxy', true);
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use("/hit", hitRoutes);
app.use(cors({
  origin: URL,
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));
app.use("/domains", domainRoutes);

app.listen(process.env.PORT || 3000);
