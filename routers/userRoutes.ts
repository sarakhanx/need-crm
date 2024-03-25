import express  from 'express';
import {isExistedUser , getAllUsers , signIn} from '../middlewares/validations';
const router = express.Router();

router.post('/signup', isExistedUser);
router.post('/signin', signIn);
router.get('/allusers', getAllUsers);


export default router;