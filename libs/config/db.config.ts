// ./libs/config/db.config.ts
import mariadb , {Pool} from "mariadb";
import dotenv from "dotenv";

dotenv.config();
let pool :Pool | undefined = undefined

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const createDatabasePool = async () => {
    if(typeof pool !== "undefined"){
        return pool;
    }
    pool = mariadb.createPool({
    connectionLimit: 5,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  });

  try {
    const connection = await pool.getConnection();
    connection.release();
    console.log("Database connected successfully");
  } catch (err: any) {
    console.error("Error connecting to the database:", err.message);
  }

  return pool;
};

export default createDatabasePool;
