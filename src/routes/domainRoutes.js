import {Router} from 'express';
import { pool } from '../config.js';
const router= Router()

router.get('/list',async (req,res) =>{
    try{
        //const[rows,fields]= await pool.execute('SELECT * from domains')
        console.log(req.params)
        res.send('asd')
    }catch(err){
        throw err
    }
})
router.post('/create',async (req,res) =>{
    try{
        const domain= req.body
        const userId= parseInt(domain.userId)
        const[rows,fields]= await pool.execute(`
            CALL createDomain(${userId}, '${domain.domainName}', '${domain.website}', ${domain.keyStatus});    
        `)
        res.send(true)
    }catch(err){
        throw err
    }
})

export default router