import {Router} from 'express';
import { pool } from '../config.js';
import {randomBytes} from 'crypto'
import axios from 'axios'
const router= Router()

router.delete('/domain',async (req,res) =>{
    try{
        const domainId= req.query.domainId
        if(!isNaN(domainId)){
            const[rows,fields]= await pool.execute(`
                CALL deleteDomain( ? );
            `,[domainId])
            if(rows.errno){
                res.status(404).json(rows.sqlMessage)
            }else{
                res.status(200).json(rows)
            }
        }else{
            res.status(400).send({error: "userId is undefined"})
        }
        
    }catch(err){
        res.status(500).json(err)
    }
})
router.put('/reset',async (req,res) =>{
    try{
        const domainId= req.body.params.domainId
        const statId= req.body.params.statId
        if(!isNaN(domainId)){
            const[rows,fields]= await pool.execute(`
                CALL resetStats( ? , ? );
            `,[domainId, statId])
            if(rows.errno){
                res.status(404).json(rows.sqlMessage)
            }else{
                res.status(200).json(rows)
            }
        }else{
            res.status(400).send({error: "userId is undefined"})
        }
        
    }catch(err){
        res.status(500).json(err)
    }
})
router.put('/domain',async (req,res) =>{
    try{
        const domainId= req.body.params.domainId
        if(!isNaN(domainId)){
            const[rows,fields]= await pool.execute(`
                CALL switchDomainStatus( ? );
            `,[domainId])
            if(rows.errno){
                res.status(404).json(rows.sqlMessage)
            }else{
                res.status(200).json(rows)
            }
        }else{
            res.status(400).send({error: "userId is undefined"})
        }
        
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})
router.put('/key',async (req,res) =>{
    try{
        const keyId= req.body.params.keyId
        if(!isNaN(keyId)){
            const[rows,fields]= await pool.execute(`
                CALL switchKeyStatus( ? );
            `,[keyId])
            if(rows.errno){
                res.status(404).json(rows.sqlMessage)
            }else{
                res.status(200).json(rows)
            }
        }else{
            res.status(400).send({error: "userId is undefined"})
        }
        
    }catch(err){
        res.status(500).json(err)
    }
})
router.get('/domain',async (req,res) =>{
    try{
        const userId= parseInt(req.query.userId)
        const domainName= req.query.domainName.split('-').join(' ')
        if(!isNaN(userId) && domainName!=''){
            const[rows,fields]= await pool.execute(`
                CALL getDomain( ? , ? );
            `,[userId, domainName])
            if(rows.errno){
                res.status(404).json(rows.sqlMessage)
            }else{
                res.status(200).json(rows[0][0])
            }
        }else{
            res.status(400).send({error: "userId is undefined"})
        }
        
    }catch(err){
        res.status(500).json(err)
    }
})
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
router.post('/hit/:domainId/:statId',async (req,res) =>{
    try{
        const {statId, domainId}= req.params
        let api_key = req.headers.api_key || '';
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
                    CALL registerHit( ? , ? , ? , ? , ? , ? , ? , ?)
                `,[parseInt(statId), '181.31.237.161', ubication, data.lat, data.lon, currentUtcTime, domainId, api_key])
                res.status(200).send({message: "Hit sucessfuly registered."})
            }
        }catch(err){
            if(err.sqlState==='45000'){
                res.status(401).send({message: "INVALID API KEY. API KEY SHOULD BE IN PETITION HEADERS AS 'API_KEY'."})
            }else if(err.sqlState==='55000'){
                res.status(401).send({message: "COUNTER IS PAUSED."})
            }else{
                res.status(500).send({message: "SOM TING WONG."})
            }
        }
    }catch(err){
        res.status(500).send({message: "SOM TING WONG."})
    }
})

export default router