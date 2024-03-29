import express  from 'express';
import {isExistedUser , getAllUsers , signIn , deleteUser , getSingleUser} from '../middlewares/validations';
const router = express.Router();
/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Register user
 *     description: Register a new user into the system
 *     responses:
 *       '200':
 *         description: A list of users
 *       '401':
 *         description: Unauthorized, authentication required
 */
router.post('/signup', isExistedUser);
/**
 * @swagger
 * /api/signin:
 *   post:
 *     summary: User signin
 *     description: Ssign user into CRMs App system
 *     responses:
 *       '200':
 *         description: A list of users
 *       '401':
 *         description: Unauthorized, authentication required
 */
router.post('/signin', signIn);
/**
 * @swagger
 * /api/allusers:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all registered users
 *     responses:
 *       '200':
 *         description: A list of users
 *       '401':
 *         description: Unauthorized, authentication required
 */
router.get('/allusers', getAllUsers);
/**
 * @swagger
 * /api/deluser:
 *   delete:
 *     summary: delete a user
 *     description: Drop user from database in NEED_CRMs
 *     responses:
 *       '200':
 *         description: Deleted a user
 *       '404':
 *         description: User not found
 */
router.delete('/deluser/:id', deleteUser);
/**
 * @swagger
 * /api/users/:id:
 *   get:
 *     summary: get a user
 *     description: get user from database in NEED_CRMs
 *     responses:
 *       '200':
 *         description: a user was found
 *       '404':
 *         description: User not found
 */
router.get('/users/:id', getSingleUser);



export default router;