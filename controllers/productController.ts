import { Request, Response, NextFunction } from "express";
import createDatabasePool from "../libs/config/db.config";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config();

export const createProduct = async (req: Request, res: Response) => {
  let conn;
  const pool = await createDatabasePool();
  const doc_id = req.body.doc_id
  const {
    title,
    description,
    size,
    qty,
    price,
    note,
    sku,
    discount,
  } = req.body.item;
  
  try {
    conn = await pool.getConnection();
    const sqlQuery =
      "INSERT INTO Product (title , description , size , qty , price , note , sku , discount , doc_id) VALUES (?,?,?,?,?,?,?,?,?)";
    await conn.query(sqlQuery, [
      title,
      description,
      size,
      qty,
      price,
      note,
      sku,
      discount,
      doc_id
    ]);
    res.status(201).json({
      message: "Product created successfully",
      data: {
        productname: title,
        description: description,
        size: size,
        qty: qty,
        price: price,
        note: note,
        sku: sku,
        discount: discount,
        doc_id: doc_id
      },
    });
    console.log(req.body.item)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
export const getAllProducts = async (req: Request, res: Response) => {
  let conn;
  const pool = await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const products = await conn.query("SELECT * FROM Product");
    res.status(200).json({ products: products[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
}
export const getSingleProd = async (req : Request , res :Response)=>{
  const params = req.params.sku
  let conn;
  const pool =  await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const isExistedProduct = await conn.query (`SELECT * FROM Product WHERE sku = ?`, [params])
    if(!isExistedProduct.length){
      return res.status(400).json({send : "data not found"})
    }
    res.status(200).json({data : isExistedProduct})
  } catch (error) {
    console.log(error)
    res.status(500).json({send : "Internal server error"})
  }
}
export const updateProduct = async (req : Request , res : Response) => {
  const sku = req.params.sku
  const {title,
    description,
    size,
    qty,
    price,
    note,
    discount,
    total_price,} = req.body
    if (!title || !description || !size || !qty || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    let conn;
    const pool = await createDatabasePool();
    try {
      conn = await pool.getConnection();
      const isExistedProduct = await conn.query(`SELECT * FROM Product WHERE sku = ?`,[sku])
      if(!isExistedProduct.length){
        console.log("A product not found")
        res.status(404).json({error:"A product not found"})
      }
      const sqlQuery = "UPDATE Product SET title = ? , description = ? , size = ? , qty = ? , price = ? , note = ? , discount = ? , total_price = ? WHERE sku = ?";
      await conn.query(sqlQuery, [
        title,
        description,
        size,
        qty,
        price,
        note,
        discount,
        total_price,
        sku
      ]);
      res.status(200).json({message:"data updated successfully"})
    } catch (error) {
      console.log(error)
      res.status(500).json({error:"Internal server error"})
    }finally{
      if(conn){
        conn.release();
      }
    }
}
export const deleteProduct = async (req : Request , res : Response)=>{
  const sku = req.params.sku
  let conn;
  const pool =  await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const isExistedProduct = await conn.query(`SELECT * FROM Product WHERE sku = ?`,[sku])
    if(!isExistedProduct.length){
      return res.status(404).json({send : "data not found"})
    }
    const sqlQuery = "DELETE FROM Product WHERE sku = ?";
    await conn.query(sqlQuery, [sku]);
    res.status(200).json({send : "Data deleted successfully"})
  } catch (error) {
    console.log(error)
    res.status(500).json({send : "Internal server error"})
  }
}