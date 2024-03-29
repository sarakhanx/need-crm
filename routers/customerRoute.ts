import express  from 'express';
import { createCustomer , deleteUser, getAllUser, getSingleUser, updateCustomer } from '../controllers/customerController';

const router = express.Router();

router.post('/add-customer' , createCustomer )
router.get('/get-customers' , getAllUser )
router.get('/get-customer/:id' , getSingleUser )
router.delete('/delete-customer/:id' , deleteUser )
router.put('/update-customer/:id' , updateCustomer )



export default router;