import express from "express";
import cors from "cors";
import router from "./routes/index.routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

const PORT_ = process.env.PORT;
app.listen(PORT_, () => console.log(`Server running on port ${PORT_}`));