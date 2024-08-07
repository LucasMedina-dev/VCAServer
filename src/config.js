import { createPool } from "mysql2/promise";
import dotenv from 'dotenv'
dotenv.config()


export const pool= createPool({
    user:process.env.USER,
    password:process.env.PASSWORD,
    host:process.env.HOST,
    port: 3306,
    database:process.env.DATABASE
})
