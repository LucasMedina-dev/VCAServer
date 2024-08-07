import { createPool } from "mysql2/promise";
import dotenv from 'dotenv'
dotenv.config()


export const pool= createPool({
    user:process.env.MYSQLUSER,
    password:process.env.MYSQL_ROOT_PASSWORD,
    host:process.env.MYSQLHOST,
    port: 3306,
    database:process.env.MYSQL_DATABASE
})
