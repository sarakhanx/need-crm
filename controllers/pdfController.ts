import { Request, Response, NextFunction } from "express";
import {generatePDF} from '../libs/puppeteer/puppeteer.config';

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