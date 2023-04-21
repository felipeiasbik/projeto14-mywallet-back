import express from "express";
import cors from "cors";
import router from "./routes/index.routes.js";
import { db } from "./database/database.connection.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

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