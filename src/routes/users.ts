import express, { RequestHandler } from 'express'
import bcrypt from 'bcrypt'

const router = express.Router();

let users =[

];

router.get("/users", ((req, res) => {
    res.json({users:users});
    return;
}) as RequestHandler);



router.post("/users", ((req, res) => {
    const newUser = req.body;

    if (!newUser || typeof newUser !== 'object') {
        res.status(400).json({ message: 'Invalid user data' });
        return;
    }

    users.push(newUser);
    res.status(201).json({message: 'User is Created!', newUser});
    return;
}) as RequestHandler);

export default router