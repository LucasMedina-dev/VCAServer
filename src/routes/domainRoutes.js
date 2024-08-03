import {Router} from 'express';
import { pool } from '../config.js';
import { randomBytes } from 'crypto'
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
            res.status(400).send({error: "domainId is not valid"})
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
            res.status(400).send({error: "domainId is not valid"})
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
            res.status(400).send({error: "domainId is not valid"})
        }
        
    }catch(err){
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
            res.status(400).send({error: "keyId is not valid"})
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
            res.status(400).send({error: "userId is not valid"})
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
            res.status(400).send({error: "userId is not valid"})
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
                    CALL createDomain( ? , ? , ? );    
                `, [userId, domain.domainName, keyCode])
                res.status(200).send(rows)
           }catch(err){
                res.status(500).send(err)
           }
        }else{
            res.status(403).send({error: "userId is not valid"})
        }
        
    }catch(err){
        
        res.status(403).json(err)
    }
})
export default router