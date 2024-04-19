import { Request, Response, NextFunction } from "express";
import createDatabasePool from "../libs/config/db.config";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config();
const originUrl = process.env.ORIGIN_URL;
export interface DocumentData {
  doc_createdAt: string;
  user_name: string;
  user_lastname: string;
  user_roles: string;
  company_name: string;
  company_address: string;
  company_contact: string;
  company_vat_id: string;
  customer_name: string;
  customer_lastname: string;
  customer_address: string;
  customer_mobile: string;
  products: string;
  total: string;
  productsArray: any | [];
  company_logo_path:string | null ;
}

export const getSomeDoc = async (req : Request, res: Response)=> {
    const params = req.params.id;
    let conn;
    const pool = await createDatabasePool();
    try {
        conn = await pool.getConnection();
        const sqlQuery = `SELECT * FROM Doc WHERE id = ${params}`;
        const result = await conn.query(sqlQuery);
        res.status(200).json({ data: result });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const createDoc = async (req: Request, res: Response) => {
  let conn;
  const pool = await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const { sellerId, dealerId, customerId } = req.body;
    const result = await conn.query(
      "INSERT INTO Doc (seller_id, dealer_id, client_id) VALUES (?, ?, ?)",
      [sellerId, dealerId, customerId]
    );
    const docId = parseInt(result.insertId);
    res.status(201).json({
      message: "Document created successfully",
      data: { sellerId, dealerId, customerId , docId },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const updateDoc = async (req: Request, res: Response) => {
  let conn;
  const pool = await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const { id, sellerId, dealerId, customerId } = req.body;
    // console.log(sellerId, dealerId, customerId);
    // Update document in the database
    const result = await conn.query(
      "UPDATE Doc SET seller_id = ?, dealer_id = ?, client_id = ? WHERE id = ?",
      [sellerId, dealerId, customerId, id]
    );
    res.status(200).json({
      message: "Document updated successfully",
      data: { sellerId, dealerId, customerId },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const getADoc = async (req: Request, res: Response) => {
  const DocId = req.params.id;
  let conn;
  const pool = await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const doc = await conn.query(
      `SELECT
          Doc.createdAt AS doc_createdAt,
          Doc.id as DocId,
          User.name AS user_name,
          User.lastname AS user_lastname,
          User.roles AS user_roles,
          Company.logo AS company_logo,
          Company.company_name AS company_name,
          Company.company_address AS company_address,
          Company.company_contact AS company_contact,
          Company.company_vat_id AS company_vat_id,
          Customer.name AS customer_name,
          Customer.lastname AS customer_lastname,
          Customer.customer_address AS customer_address,
          Customer.customer_mobile AS customer_mobile,
          Customer.company_name AS customer_company_name,
          (
              SELECT GROUP_CONCAT(
                  CONCAT(
                      'Title: ', title, ', ',
                      'Size: ', size, ', ',
                      'Qty: ', qty, ', ',
                      'Price: ', price, ', ',
                      'Discount: ', discount, ', ',
                      'Total Price: ', total_price
                  ) SEPARATOR '; '
              )
              FROM Product
              WHERE Product.doc_id = Doc.id
          ) AS products,
          (
              SELECT SUM(total_price)
              FROM Product
              WHERE Product.doc_id = Doc.id
          ) AS net
      FROM Doc
      JOIN Company ON Doc.dealer_id = Company.id
      JOIN User ON Doc.seller_id = User.id
      JOIN Customer ON Doc.client_id = Customer.id
      WHERE Doc.id = ?;
      `,
      [DocId]
    );
    const data = doc[0];
    const productsString = doc[0].products;
    const productsArray = productsString
      ? productsString.split("; ").map((product: any) => {
          const attributes = product.split(", ");
          const productObject = {} as any;
          attributes.forEach((attribute: any) => {
            const [key, value] = attribute.split(": ");
            productObject[key.trim()] = value.trim();
          });
          return productObject;
        })
      : [];
    const documentData: DocumentData = { ...data, productsArray };

    const logoPath = data.company_logo
      ? `${originUrl}/uploads/company_assets/${data.company_logo}`
      : null;
    documentData.company_logo_path = logoPath;
    res.status(200).json({ doc: documentData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};


export const deleteDoc = async (req: Request, res: Response) => {
  const params = req.params.id;
  let conn;
  const pool = await createDatabasePool();

  try {
    conn = await pool.getConnection();
    const isExisted = await conn.query(`SELECT * FROM Doc WHERE id = ?`, [
      params,
    ]);
    if (!isExisted.length) {
      return res.status(400).json({ send: "data not found" });
    }
    const sqlQuery = "DELETE FROM Doc WHERE id = ?";
    await conn.query(sqlQuery, [params]);
    res.status(200).json({ send: "data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

export const getAllDocs = async (req: Request, res: Response) => {
  let conn;
  const pool = await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const docs = await conn.query(`SELECT
        Doc.createdAt AS doc_createdAt,
        User.name AS user_name, User.lastname AS user_lastname, User.roles AS user_roles,
        Company.company_name AS company_name, Company.company_address AS company_address, Company.company_contact AS company_contact, Company.company_vat_id AS company_vat_id,
        Customer.name AS customer_name, Customer.lastname AS customer_lastname, Customer.customer_address AS customer_address, Customer.customer_mobile AS customer_mobile,
        (SELECT GROUP_CONCAT(CONCAT( 
            'Title: ', title, ', ',
            'Size: ', size, ', ',
            'Qty: ', qty, ', ',
            'Price: ', price, ', ',
            'Discount: ', discount, ', ',
            'Total Price: ', total_price
        ) SEPARATOR '; ') FROM Product WHERE Product.doc_id = Doc.id) AS products,
        (SELECT SUM(total_price) FROM Product WHERE Product.doc_id = Doc.id) AS total
    FROM Doc
    JOIN Company ON Doc.dealer_id = Company.id
    JOIN User ON Doc.seller_id = User.id
    JOIN Customer ON Doc.client_id = Customer.id`);
    const allDocs: DocumentData[] = [];
    for (let i = 0; i < docs.length; i++) {
      const data: DocumentData = docs[i];
      const productsString = docs[i].products;
      const productsArray = productsString
        ? productsString.split("; ").map((product: any) => {
            const attributes = product.split(", ");
            const productObject: any = {};
            attributes.forEach((attribute: any) => {
              const [key, value] = attribute.split(": ");
              productObject[key.trim()] = value.trim();
            });
            return productObject;
          })
        : [];
      allDocs.push({ ...data, productsArray });
    }
    res.status(200).json({ doc: allDocs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getDocsBySeller = async (req : Request , res : Response) =>{
  let conn;
  const pool = await createDatabasePool();
  const sellerId = req.params.sellerId;
  console.log(sellerId)
try {
  conn = await pool.getConnection();
  const query = `SELECT
  Doc.createdAt, Doc.id AS id,
  User.name AS user_name, User.lastname AS user_lastname, User.roles,
  Company.company_name, Company.company_address, Company.company_contact, Company.company_vat_id,
  Customer.name AS customer_name, Customer.lastname AS customer_lastname, Customer.customer_address, Customer.customer_mobile, Customer.company_name AS customer_company_name, Customer.id AS customer_id,
  (
    SELECT GROUP_CONCAT(CONCAT(
      'Title: ', title, ', ',
      'Size: ', size, ', ',
      'Qty: ', qty, ', ',
      'Price: ', price, ', ',
      'Discount: ', discount, ', ',
      'Total Price: ', total_price
    ) SEPARATOR '; ') FROM Product WHERE Product.doc_id = Doc.id
  ) AS products
FROM Doc
JOIN Company ON Doc.dealer_id = Company.id
JOIN User ON Doc.seller_id = User.id
JOIN Customer ON Doc.client_id = Customer.id
WHERE User.id = ? ;`

const docs = await conn.query(query, [sellerId]);
const allDocs: DocumentData[] = [];
for(let i = 0 ; i < docs.length ; i++){
  const data : DocumentData = docs[i];
  const productsString = docs[i].products;
  const productsArray = productsString ? productsString.split("; ").map((product : any) => {
    const attributes = product.split(", ");
    const productObject : any = {};
    attributes.forEach((attribute : any) => {
      const [key , value] = attribute.split(": ");
      productObject[key.trim()] = value.trim();
    });
    return productObject;
  }) : [];
  allDocs.push({ ...data ,  productsArray})
}

res.status(200).json({ docs: allDocs });
} catch (error : Error | any) {
  throw new Error(error)
}
}