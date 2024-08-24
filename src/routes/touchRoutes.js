import { Router } from "express";
import { pool } from "../config.js";
import moment from 'moment-timezone'
const router = Router();

router.get("/", async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'];
    const buenosAiresTime = moment().tz('America/Argentina/Buenos_Aires').toDate();
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    ip==='::1' ?? res.status('403').json({error: 'Ip requested was ::1'})
    const [rows, fields] = await pool.execute(
      `
                CALL registerTouch( ? , ? , ? )
            `,
      [buenosAiresTime, ip, userAgent]
    );
    res.status(200).send(rows[0][0]);
  } catch (err) {
    if (err.sqlState === "45000") {
      res
        .status(401)
        .send({
          message:
            "INVALID API KEY. API KEY SHOULD BE IN PETITION HEADERS AS 'API_KEY'.",
        });
    } else if (err.sqlState === "55000") {
      res.status(401).send({ message: "COUNTER IS PAUSED." });
    } else {
     console.log(err)
      res.status(500).send({ message: "SOM TING WONG." });
    }
  }
});
export default router;
