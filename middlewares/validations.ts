import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import createDatabasePool from "../libs/config/db.config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
dotenv.config();
const jwtToken = process.env.JWT_SECRET;

export const isExistedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email, telephone, address, name , lastname } = req.body;
  let conn;
  const pool = await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const isUserExisted = await conn.query(
      `SELECT * FROM User WHERE email = ?`,
      [email]
    );
    if (isUserExisted.length > 0) {
      return res.status(409).json({
        message: "User already existed",
      });
    } else {
      const defaultRole = "seller";
      const roles = req.body.roles || defaultRole;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const sqlQuery =
        "INSERT INTO User(username, password, email, telephone, address , name , lastname , roles) VALUES(?,?,?,?,?,?,?,?)";
        await pool.query(sqlQuery, [
          username,
          hashedPassword,
          email,
          telephone,
          address,
          name,
          lastname,
          roles
        ]);
      return res.status(201).json({
        message: "User created successfully",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  let conn;
  const pool = await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const user = await conn.query("SELECT * FROM User WHERE username = ?", [
      username,
    ]);

    if (user.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a JWT
    const token = jwt.sign(
      { userId: user[0].id, username: user[0].username },
      // Replace with your secure secret
      process.env.JWT_SECRET || `${jwtToken}`,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  let conn;
  const pool = await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const users = await conn.query("SELECT * FROM User");
    const numberToString = users.map((user : any)=>{
      return {
        ...user , telephone: user.telephone.toString(),
      }
    })

    res.status(200).json({ users: numberToString });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error eh" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  let conn;
  const pool = await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const sqlQuery = "DELETE FROM User WHERE id = ?";
    await conn.query(sqlQuery, [id]);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

export const getSingleUser = async (req : Request , res : Response) =>{
  const params = req.params.id
  let conn;
  const pool = await createDatabasePool();

  try {
    conn = await pool.getConnection();
    const sqlQuery = "SELECT * FROM User WHERE id = ?"
    const data = await conn.query(sqlQuery,[params])
    const dataString = data.map((user : any)=>{
      return {
        ...user , telephone: user.telephone.toString(),
      }
    })
    if(!sqlQuery.length){
      return res.status(404).json({send:"user not found"})
    }
    res.status(200).json({user:dataString})
  } catch (error) {
    console.log(error)
    res.status(400).json({send:"user not found"})
  }
}
