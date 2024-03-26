import { Request, Response, NextFunction } from "express";
import createDatabasePool from "../libs/config/db.config";
import dotenv from "dotenv";
import { uploadLogo } from "../libs/multer/config";
import path from "path";
import fs from "fs";

dotenv.config();

export const getAllCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let conn;
  const pool = await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const sqlQuery = "SELECT * FROM Company";
    const result = await conn.query(sqlQuery);
    const companies = [];
    for (const data of result) {
      const imgPath = path.join(
        __dirname,
        `../uploads/company_assets/${data.logo}`
      );
      if (fs.existsSync(imgPath)) {
        const imgUrl = `/uploads/company_assets/${data.logo}`;
        companies.push({ ...data, imgUrl });
      } else {
        res.status(400).json({ send: "logo or data fields not found" });
      }
    }
    res.status(200).json({ data: companies });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadLogo.single("file")(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ send: "error while uploading logo, Please try again later" });
    }
    const file = req.file;
    const logoName = file?.filename;
    if (!req.file) {
      console.log("no file was found in Upload..., Please try again");
      return res
        .status(400)
        .json({ send: "not found file attached, Please try again" });
    }
    const { company_name, company_address, company_vat_id, company_contact } =
      req.body;
    let conn;
    const pool = await createDatabasePool();
    try {
      conn = await pool.getConnection();
      const sqlQuery =
        "INSERT INTO Company(logo , company_name , company_address , company_vat_id , company_contact) VALUES(? , ? , ? , ? , ?)";
      pool.query(sqlQuery, [
        logoName,
        company_name,
        company_address,
        company_vat_id,
        company_contact,
      ]);
      res.status(201).json({
        message: "Company created successfully",
        data: {
          companyLogo: logoName,
          companyName: company_name,
          companyAddress: company_address,
          companyVatId: company_vat_id,
          companyContact: company_contact,
        },
      });
    } catch (error) {
      console.log("error in creating company", error);
      next(error);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  });
};
export const updateCompany = async (req: Request, res: Response) => {
  const params = req.params.id;
    const { company_name, company_address, company_vat_id, company_contact } =
      req.body;
    let conn;
    const pool = await createDatabasePool();
    try {
      conn = await pool.getConnection();
      const isExisted = await conn.query(`SELECT * FROM Company WHERE id = ?`, [
        params,
      ]);
      if (!isExisted) {
        return res.status(400).json({ send: "data not found" });
      }
      const sqlQuery =
        "UPDATE Company SET company_name = ? , company_address = ? , company_vat_id = ? , company_contact = ? WHERE id = ?";
      await conn.query(sqlQuery, [
        company_name,
        company_address,
        company_vat_id,
        company_contact,
        params,
      ]);
      res.status(200).json({ send: "data updated successfully", data: req.body });
    } catch (error) {
      console.log(error);
      res.status(500).json({ send: "Internal server error" });
    } finally {
      if (conn) {
        conn.release();
      }
    }
};
export const deleteCompany = async (req : Request , res : Response)=>{
    const params = req.params.id
    let conn;
    const pool =  await createDatabasePool();
    try {
        conn = await pool.getConnection();
        const isExisted = await conn.query(`SELECT * FROM Company WHERE id = ?`,[params])
        if(!isExisted.length){
            return res.status(400).json({send : "data not found"})
        }
        const imagePath = path.join(__dirname, `../uploads/company_assets/${isExisted[0].logo}`);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
        const sqlQuery = "DELETE FROM Company WHERE id = ?"
        conn.query(sqlQuery,[params])
        res.status(200).json({send : "data deleted successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({send : "Internal server error"})
    }
}
export const getACompany = async (req : Request , res : Response)=>{
  const params = req.params.id
  let conn;
  const pool =  await createDatabasePool();
  try {
    conn = await pool.getConnection();
    const isExistedCompany = await conn.query (`SELECT * FROM Company WHERE id = ?`, [params])
    if(!isExistedCompany){
      return res.status(400).json({send : "data not found"})
    }
    res.status(200).json({data : isExistedCompany})
  } catch (error) {
    console.log(error)
    res.status(500).json({send : "Internal server error"})
  }
}