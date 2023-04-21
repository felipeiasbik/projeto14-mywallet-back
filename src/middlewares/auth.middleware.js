import { db } from "../database/database.connection.js";

export async function authValidation (req, res, next) {
    
    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.sendStatus(401);

    try {

        const session = await db.collection("sessions").findOne({token});
        if (!session) return res.status(401);
        // const user = await db.collection("users").findOne({_id: session.userId});
        // if (user) delete user.password;
        // res.send(user);
        next();

    } catch (err) {
        res.status(500).send(err.message);
    }
}