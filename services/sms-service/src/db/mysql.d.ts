import mysql from 'mysql2/promise';
export declare const pool: mysql.Pool;
export declare function query(sql: string, params?: any[]): Promise<mysql.QueryResult>;
