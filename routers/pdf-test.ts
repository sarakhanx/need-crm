import { Router } from "express";
import {docsControllerTest} from '../controllers/pdfController';
const router = Router();

router.get('/genarate-pdf/:id', docsControllerTest )


export default router