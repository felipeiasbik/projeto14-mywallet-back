import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";

const app = express();

// CONFIGURAÇÕES
app.use(express.json());
app.use(cors());
dotenv.config();

// CONEXÃO COM BANCO DE DADOS
const mongoClient = new MongoClient(process.env.DATABASE_URL);
try {
    await mongoClient.connect();
    console.log("MongoDB conectado!");
} catch (err) {
    console.log(err.message);
}
const db = mongoClient.db();

const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).required()
});

app.post("/cadastro", async (req, res) => {

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

});

app.get("/cadastro", async (req, res) => {

    const {name} = req.headers;
    console.log(name)

    try {
        const users = await db.collection("users").find().toArray();
        res.send(users);
    } catch (err) {
        res.status(500).send(err.message);
    }

    
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));