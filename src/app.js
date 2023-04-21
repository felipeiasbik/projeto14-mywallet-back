import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import authRouter from "./routes/authRoutes.js";

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
export const db = mongoClient.db();

app.use(authRouter);

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