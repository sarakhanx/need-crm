import { Request, Response, NextFunction } from "express";
import createDatabasePool from "../libs/config/db.config";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

export const createCustomer = async (req: Request, res: Response) => {
  let conn;
  const pool = await createDatabasePool();
  try {
    const {
      name,
      lastname,
      customer_address,
      customer_email,
      customer_mobile,
      company_address,
      company_contact,
      company_name,
      company_vat,
    } = req.body;
    conn = await pool.getConnection();
    const sqlQuery = `INSERT INTO Customer(name, lastname, customer_address, customer_email, customer_mobile, company_address, company_contact, company_name, company_vat) VALUES(?,?,?,?,?,?,?,?,?)`;
    const result = await conn.query(sqlQuery, [
      name,
      lastname,
      customer_address,
      customer_email,
      customer_mobile,
      company_address,
      company_contact,
      company_name,
      company_vat,
    ]);
    const data = {
      affectedRows: result.affectedRows,
      insertId: result.insertId,
      warningCount: result.warningCount,
      message: result.message,
    };
    // todo: back to make validation via email and mobile again
    if (!data) {
      return res
        .status(400)
        .json({ send: "some fields is blank or something went wrongs" });
    }
    res.status(200).json({
      send: "data inserted successfully",
      data: {
        ...data,
        insertId: String(data.insertId), //จริงๆ ใช้ JSON.STRINGIFY ได้ แต่อยากลองแบบนี้ เพราะงงดี ฮ่าๆ
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ send: "Internal server error" });
  }
};
export const getAllUser = async (req: Request, res: Response) => {
  let conn;
  const pool = await createDatabasePool();

  try {
    conn = await pool.getConnection();
    const users = await conn.query("SELECT * FROM Customer");
    if (!users) {
      console.log("data not found");
      return res.status(404).json("user not found");
    }
    res.status(200).json({ data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ send: "Internal server error" });
  }
};
export const getSingleUser = async (req: Request, res: Response) => {
  const params = req.params.id;
  let conn;
  const pool = await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const user = await conn.query(`SELECT * FROM Customer WHERE id = ?`, [
      params,
    ]);
    if (!user.length) {
      console.log("user not found");
      return res.status(404).json({ send: "user not found" });
    }
    return res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ send: "Internal server error" });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  const params = req.params.id;
  let conn;
  const pool = await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const sqlQuery = "DELETE FROM Customer WHERE id = ?";
    const result = await conn.query(sqlQuery, [params]);
    if (!result) {
      console.log("Customer not found");
      return res.status(404).json({ send: "Customer not found" });
    }
    res.status(200).json({ send: "deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ send: "Internal server error" });
  }
};
export const updateCustomer = async (req: Request, res: Response) => {
  const params = req.params.id;
  const {
    name,
    lastname,
    customer_address,
    customer_email,
    customer_mobile,
    company_address,
    company_contact,
    company_name,
    company_vat,
  } = req.body;
  let conn;
  const pool = await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const isExistedCustomer = await conn.query(
      `SELECT * FROM Customer WHERE id = ?`,
      [params]
    );
    if (!isExistedCustomer) {
      return res.status(400).json({ send: "user not found" });
    }
    const sqlQuery = `UPDATE Customer SET name = ?, lastname = ?, customer_address = ?, customer_email = ?, customer_mobile = ?, company_address = ?, company_contact = ?, company_name = ?, company_vat = ? WHERE id = ?`;
    const result = await conn.query(sqlQuery, [
      name,
      lastname,
      customer_address,
      customer_email,
      customer_mobile,
      company_address,
      company_contact,
      company_name,
      company_vat,
      params,
    ]);
    if(!result){
      return res.status(400).json({ send: "some fields is blank or something went wrongs" });
    }
    res.status(200).json({
        send: "data inserted successfully",
        data: {
          ...result,
          insertId: String(result.insertId), //จริงๆ ใช้ JSON.STRINGIFY ได้ แต่อยากลองแบบนี้ เพราะงงดี ฮ่าๆ
        },
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ send: "Internal server error" });
  }finally{
    if(conn){
        conn.release();
    }
  }
};
