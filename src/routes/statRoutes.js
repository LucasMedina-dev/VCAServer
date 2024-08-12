import {Router} from 'express';
import { pool } from '../config.js';
import axios from 'axios'
const router= Router()

router.get('/:domainId/:statId',async (req,res) =>{
    try{
        const {statId, domainId}= req.params
        let API_KEY = req.headers.api_key || '';
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        ip==='::1' ?? res.status('403').json({error: 'Ip requested was ::1'})
        try{
            const {data}= await axios.get(`http://ip-api.com/json/181.93.172.58`)
            const ubication= `${data.country}, ${data.regionName}, ${data.city}`
            const currentUtcTime = new Date();
            if(data.status==='fail'){
                res.status(500).json({error: 'Geolocalizer returned error.'})
            }else{
                const [rows,fields]= await pool.execute(`
                    CALL registerHit( ? , ? , ? , ? , ? , ? , ? , ? , ? )
                `,[parseInt(statId), "181.93.172.58", ubication, userAgent, data.lat, data.lon, currentUtcTime, domainId, API_KEY])
                res.status(200).send({message: "Hit sucessfuly registered."})
            }
        }catch(err){
            if(err.sqlState==='45000'){
                res.status(401).send({message: "INVALID API KEY. API KEY SHOULD BE IN PETITION HEADERS AS 'API_KEY'."})
            }else if(err.sqlState==='55000'){
                res.status(401).send({message: "COUNTER IS PAUSED."})
            }else{
                res.status(500).send(err)
            }
        }
    }catch(err){
        res.status(500).send({message: "SOM TING WONG."})
    }
})
export default router