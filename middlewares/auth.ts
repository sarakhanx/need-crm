import  jwt  from 'jsonwebtoken';
import { Request, Response } from "express";
const jwtToken = process.env.JWT_SECRET;

export const authorization = async (req : Request , res : Response) =>{
    const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || `${jwtToken}`, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.json({ message: "Authorized", user: decoded });
    })
}