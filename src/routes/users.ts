import express, { RequestHandler } from 'express'
import bcrypt from 'bcrypt'
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
// import {pool}  from '../Authentication/auth' // or wherever you export the pool


const router = express.Router();

router.get("/user", verifySession(), async(req,res) =>{
    // try{
    //     const result = await pool.query('SELECT * FROM public."Users"');
    //     res.json({users: result.rows});
    // } catch (error){
    //     console.log('Error fetching users:', error);
    //     res.status(500).json({message: "Internal server error"});
    // }

    res.json("We LIVE")
});



export default router