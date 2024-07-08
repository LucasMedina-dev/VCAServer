import {Router} from 'express';
import { pool } from '../config.js';
const router= Router()

router.get('/list',async (req,res) =>{
    try{
        const userId= req.headers.userid
        if(userId!=undefined){
            const[rows,fields]= await pool.execute(`
                CALL getDomainsList(?);
            `,[userId])
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
router.post('/create',async (req,res) =>{
    try{
        const domain= req.body
        console.log(domain)
        const userId= parseInt(domain.userId)
        if(!isNaN(userId)){
            const[rows,fields]= await pool.execute(`
                CALL createDomain(?,?,?,?);    
            `, [userId, domain.domainName, domain.domainWebsite, domain.domainStatus])
            res.status(200).send(rows)
        }else{
            res.status(403).send({error: "userId is not valid"})
        }
        
    }catch(err){
        res.status(500).json(err)
    }
})

export default router