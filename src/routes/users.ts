import express, { RequestHandler } from 'express'
import bcrypt from 'bcrypt'
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import {pool}  from '../Authentication/authConfig' // or wherever you export the pool


const router = express.Router();

router.get("/user", verifySession(), async(req,res) =>{
    res.status(200).json({
        status: "A OKAY",
        database: "Connected"
    });
    try{
        const result = await pool.query('SELECT * FROM public."Users"');
        res.json({users: result.rows});
    } catch (error){
        console.log('Error fetching users:', error);
        res.status(500).json({message: "Internal server error"});
    }
});


export default router