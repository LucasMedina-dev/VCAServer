import { createPool } from "mysql2/promise";
import dotenv from 'dotenv'
dotenv.config()


export const pool= createPool({
    user:'root',
    password:'vca1234',
    host:'127.0.0.1',
    port: 3306,
    database:'vcadb'
})
