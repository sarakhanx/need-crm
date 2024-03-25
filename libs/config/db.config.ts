// ./libs/config/db.config.ts
import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const createDatabasePool = async () => {
    const pool = mariadb.createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        connectionLimit: 5
    });

    try {
        const connection = await pool.getConnection();
        connection.release();
        console.log('Database connected successfully');
    } catch (err : any) {
        console.error('Error connecting to the database:', err.message);
    }

    return pool;
};

export default createDatabasePool;
