import mysql from 'mysql2/promise';
import { config } from '../config';

export const pool = mysql.createPool(config.mysql);

export async function query(sql: string, params: any[] = []) {
    const [results] = await pool.execute(sql, params);
    return results;
}
