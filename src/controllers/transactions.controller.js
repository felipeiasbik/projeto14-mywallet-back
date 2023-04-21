import { ObjectId } from "mongodb";
import { db } from "../database/database.connection.js";

export async function transactionsUser (req, res) {
    
    const {description, value, type} = req.body;
    const session = res.locals.session;
    
    try {
        const id = session._id;
        await db.collection("transactions").insertOne({description, value, type, id});

        // console.log(await db.collection("transactions").find({id}).toArray())

        res.send("Transação adicionada com sucesso!")
    } catch (err) {
        res.status(500).send(err.message);
    }
}