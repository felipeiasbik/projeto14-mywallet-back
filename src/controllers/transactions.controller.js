import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function transactionsUser (req, res) {
    
    const {description, value, type} = req.body;
    const session = res.locals.session;
    
    try {
        const id = session.userId;
        await db.collection("transactions").insertOne({description, value, type, id, date: dayjs(Date.now()).format("DD/MM")});

        res.send("Transação adicionada com sucesso!")
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function transactionsGetUser (req, res){
    
    const session = res.locals.session;

    try {

        const id = session.userId;

        const user = await db.collection("users").findOne({_id: session.userId})
        const name = user.name;
        
        const transactions = await db.collection("transactions").find({email: session.email}).toArray();

        let sumPositive = 0;
        let sumNegative = 0;
        let sumFinal = 0;
        const total = transactions.map( v => {
            if (v.type === "input") {
                sumPositive += v.value;
            } else if (v.type === "output"){
                sumNegative += v.value;
            }
            return sumFinal = sumPositive - sumNegative;
        })

        await db.collection("transactions").updateMany({id}, {$set: {name: name, total: total[total.length-1]}});
        const transactionsFinals = await db.collection("transactions").find({id}).sort({_id: -1}).toArray();

        res.send(transactionsFinals);
    } catch (err) {
        res.status(500).send(err.message);
    }
}