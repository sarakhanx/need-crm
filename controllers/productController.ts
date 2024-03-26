import { Request, Response, NextFunction } from "express";
import createDatabasePool from "../libs/config/db.config";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

export const createProduct = async (req: Request, res: Response) => {
  let conn;
  const pool = await createDatabasePool();
  const {
    title,
    description,
    size,
    qty,
    price,
    note,
    sku,
    discount,
    total_price,
  } = req.body;
  try {
    conn = await pool.getConnection();
    const sqlQuery =
      "INSERT INTO Product (title , description , size , qty , price , note , sku , discount , total_price) VALUES (?,?,?,?,?,?,?,?,?)";
    await conn.query(sqlQuery, [
      title,
      description,
      size,
      qty,
      price,
      note,
      sku,
      discount,
      total_price,
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
        total_price: total_price,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
