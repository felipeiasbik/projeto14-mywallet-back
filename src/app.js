import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

app.post("/", async (req, res) => {

    try {
        
    } catch (err) {
        res.status(500).send(err.message);        
    }

});

app.get("/", async (req, res) => {

});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));