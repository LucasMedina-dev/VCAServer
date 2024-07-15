import {Router} from 'express';
import { pool } from '../config.js';
import {randomBytes} from 'crypto'
import axios from 'axios'
const router= Router()

router.get('/list',async (req,res) =>{
    try{
        const userId= parseInt(req.query.userId)
        if(!isNaN(userId)){
            const[rows,fields]= await pool.execute(`
                CALL getDomainsList( ? );
            `,[userId])
            if(rows.errno){
                res.status(404).json(rows.sqlMessage)
            }else{
                res.status(200).json(rows[0])
            }
        }else{
            res.status(400).send({error: "userId is undefined"})
        }
        
    }catch(err){
        res.status(500).json(err)
    }
})
router.post('/create',async (req,res) =>{
    try{
        const domain= req.body
        const userId= parseInt(domain.userId)        
        if(!isNaN(userId)){
            const keyCode= randomBytes(15).toString('hex')
           try{
                const[rows,fields]= await pool.execute(`
                    CALL createDomain( ? , ? , ? , ?, ? , ? );    
                `, [userId, domain.domainName, domain.domainWebsite, true, domain.keyStatus, keyCode])
                res.status(200).send(rows)
           }catch(err){
                console.log(err)
                res.status(500).send(err)
           }
        }else{
            res.status(403).send({error: "userId is not valid"})
        }
        
    }catch(err){
        
        res.status(403).json(err)
    }
})
router.post('/hit/:statId',async (req,res) =>{
    try{
        const {statId}= req.params
        const reqData= req.query
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        ip==='::1' ?? res.status('403').json({error: 'Ip requested was ::1'})
        try{
            const {data}= await axios.get(`http://ip-api.com/json/181.31.237.160`)
            const ubication= `${data.country}, ${data.regionName}, ${data.city}`
            const currentUtcTime = new Date();
            if(data.status==='fail'){
                res.status(500).json({error: 'Geolocalizer returned error.'})
            }else{
                const [rows,fields]= await pool.execute(`
                    CALL registerHit( ? , ? , ? , ? , ? , ?)
                `,[parseInt(statId), '181.31.237.161', ubication, data.lat, data.lon, currentUtcTime])
                res.status(200).send({message: "Hit sucessfuly registered."})
            }
        }catch(err){
            console.error(err)
        }
    }catch(err){
        res.status(403).json(err)
    }
})

export default router