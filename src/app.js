import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt";
import { MongoClient, ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";

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

app.post("/", async (req, res) => {

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


});

app.get("/", async (req, res) => {

    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.sendStatus(401);

    try {
        const session = await db.collection("sessions").findOne({token});
        if (!session) return res.sendStatus(401);

        const user = await db.collection("users").findOne({_id: session.userId});

        if (user) delete user.password;

        res.send(user);
        console.log(user);

    } catch (err) {
        res.status(500).send(err.message);
    }
    
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));