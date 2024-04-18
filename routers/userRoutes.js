"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validations_1 = require("../middlewares/validations");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
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
router.post('/signup', validations_1.isExistedUser);
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
router.post('/signin', validations_1.signIn);
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
router.get('/allusers', auth_1.authorization, validations_1.getAllUsers);
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
router.delete('/deluser/:id', validations_1.deleteUser);
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
router.get('/users/:id', validations_1.getSingleUser);
exports.default = router;
