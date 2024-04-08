import express from "express";
import { createDoc , updateDoc , getADoc , deleteDoc , getAllDocs, getSomeDoc}  from "../controllers/docsController";
import {authorization} from "../middlewares/auth";

const router = express();

router.get('/testDoc/:id',getSomeDoc)
router.post('/create-doc', createDoc);
router.put('/update-doc', updateDoc);
router.get('/get-docs', getAllDocs);
router.get('/get-a-doc/:id',authorization, getADoc);
router.delete('/del-doc/:id', deleteDoc);



export default router;