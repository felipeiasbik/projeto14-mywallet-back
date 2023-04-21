import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { db } from "../database/database.connection.js"
import { ObjectId } from "mongodb";

export async function signUp (req, res) {

    const {name, email, password} = req.body;
    const signUp = {name, email, password};

    try {

        const userExists = await db.collection("users").findOne({email});
        if (userExists) return res.status(409).send("E-mail já cadastrado!");

        const passCrypt = bcrypt.hashSync(password, 10);

        await db.collection("users").insertOne({name, email, password: passCrypt});
        res.sendStatus(201);
        
    } catch (err) {
        res.status(500).send(err.message);        
    }

};

export async function signIn (req, res) {

    const { email, password } = req.body;

    const user = await db.collection("users").findOne({email});
    try {        
        if (user && bcrypt.compareSync(password, user.password)){
            const token = uuid();    
            await db.collection("sessions").insertOne({userId: user._id, token});
            res.send(token);
        }

        if(!user) return res.status(404).send("Email não cadastrado!");

        if (user && !bcrypt.compareSync(password, user.password)) return res.status(401).send("Senha incorreta!");

    } catch (err) {
        res.status(500).send(err.message);  
    }


};

export async function getUser (req, res) {

    try {
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
    
};