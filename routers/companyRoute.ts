import  express  from "express";
import { getAllCompanies , createCompany , updateCompany , deleteCompany, getACompany} from "../controllers/companyController";


const router = express.Router();

router.get('/companies', getAllCompanies);
router.post('/createcompanies', createCompany);
router.put('/updatecompanies/:id', updateCompany);
router.delete('/deletecompanies/:id', deleteCompany);
router.get('/company/:id', getACompany);



export default router;