import dotenv from 'dotenv';
import { Request, Response, NextFunction } from "express";
import {generatePDF} from '../libs/puppeteer/puppeteer.config';
import createDatabasePool from "../libs/config/db.config"; //sql

dotenv.config();
const url = process.env.URL

export const docsControllerTest = async (req :Request, res :Response , next :NextFunction) =>{
    const params = req.params.id

    try {
        const pdfBuffer = await generatePDF(params);
        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (error : any) {
        throw new Error(error.message);
    }
}