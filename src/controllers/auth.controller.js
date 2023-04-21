import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import joi from "joi";
import { db } from "../app.js"

const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).required()
});

export async function signUp (req, res) {

    const {name, email, password} = req.body;
    const signUp = {name, email, password};

    const validation = signUpSchema.validate(signUp, {aboutEarly: false});

    if (validation.error) {
        const errors = validation.error.details.map( err => err.message);
        return res.status(422).send(errors);
    }

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

export async function sigIn (req, res) {

    const { email, password } = req.body;

    const user = await db.collection("users").findOne({email});

    try {
        if (user && bcrypt.compareSync(password, user.password)){
            const token = uuid();    
            await db.collection("sessions").insertOne({userId: user._id, token});
            res.send(token);
        }

    } catch (err) {
        res.status(500).send(err.message);  
    }


};