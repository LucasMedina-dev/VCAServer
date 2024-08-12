import express from "express";
import domainRoutes from "./routes/domainRoutes.js";
import hitRoutes from "./routes/hitRoutes.js";
import statRoutes from "./routes/statRoutes.js";
import cors from 'cors';

const app = express();
const URL = 'https://visitorcounterapi.vercel.app';

app.set('trust proxy', true);

app.use('/domains', cors({
  origin: URL,
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/hit", hitRoutes);
app.use("/stats", statRoutes);
app.use("/domains", domainRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
