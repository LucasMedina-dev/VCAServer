import {Router} from 'express';
import { pool } from '../config.js';
const router= Router()

router.get('/:domainId/:statId',async (req,res) =>{
    try{
        const {statId, domainId}= req.params
        let API_KEY = req.headers.api_key || '';
        try{
            const [rows,fields]= await pool.execute(`
                CALL getCounter( ? , ? , ? )
            `,[domainId, statId, API_KEY])
            res.status(200).send(rows[0][0])
        }catch(err){
            console.log(err)
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