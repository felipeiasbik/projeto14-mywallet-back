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

export async function transactionsGetUser (req, res){

    // const { description, value, type, id} = req.body;
    // const session = res.locals.session;

    // try {
    //     const inputsTransactions = await db.collection("transactions").find({id}).toArray();
    //     console.log(inputsTransactions);
    //     const user = await db.collection("users").findOne({_id: session.userId});
    //     const name = user.name;
    //     delete inputsTransactions._id;
    //     const transactions = await db.collection("transactionsFinals").insertOne({...inputsTransactions, description, value, type})
    //     const transactionsView = await db.collection("transactionsFinals").find({id}).toArray();

    //     res.send(transactionsView)
    // } catch (err) {
    //     res.status(500).send(err.message);
    // }
 
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    const session = res.locals.session;

    try {

        const id = session._id;
    //     const inputsTransactions = await db.collection("transactions").find({id}).toArray()
    //     const description = inputsTransactions.description;
    //     const value = inputsTransactions.value;
    //     const type = inputsTransactions.type;

        const user = await db.collection("users").findOne({_id: session.userId})
        const name = user.name;

    //     const transactionsFinalsPromises = inputsTransactions.map( v => {
    //         delete v._id;
    //         delete v.id;
    //         db.collection("transactionsFinals").insertOne({...v, idUser: id, name: name, total: total[total.length-1]})
    //     })
    //     delete transactionsFinalsPromises["_id"]
    //     const transactionsFinals = await Promise.all(transactionsFinalsPromises);

    //     const finals = await db.collection("transactionsFinals").find({idUser: id}).toArray();
    
        // console.log(finals)
        
        const transactions = await db.collection("transactions").find({id}).toArray();

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